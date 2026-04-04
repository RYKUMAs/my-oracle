## Memory Rule

When important information appears:
- Save it into .claude/MEMORY.md
- Organize into correct section (user, project, feedback, reference)
- Do not store temporary data

## Motor Control
- TMC2209 ต้องตั้ง UART
- step timing สำคัญมาก

## Vision
- ลด resolution → FPS เพิ่ม

## MQTT - Face Recognition System
**Broker:** 178.128.49.254:1883

**Topics:**
- `RCN/IDXXXX/image` - ส่งรูปบุคคล (base64)
- `RCN/IDXXXX/DATA` - ส่งข้อมูล ("yes")

**Flow:**
1. Face detected → Recognize ID
2. Capture image → Convert to base64
3. Publish to `RCN/IDXXXX/image`
4. Publish "yes" to `RCN/IDXXXX/DATA`

---

## Face Recognition System (CanMV/K230)

### Project Location
`j:\CodeAgent\facericonition\`

### Architecture

```
facericonition/
├── main.py                 - Main application with Face Recognition + MQTT
├── mqtt_client.py          - MQTT client wrapper
├── examples/
│   ├── 05-AI-Demo/
│   │   ├── face_recognition.py         - Full face recognition
│   │   ├── face_recognition_lite.py    - Lightweight version (mobile model)
│   │   ├── face_registration.py        - Face registration (create DB)
│   │   ├── face_detection.py           - Face detection only
│   │   └── ...
│   ├── kmodel/              - AI model files (.kmodel)
│   └── utils/               - Utilities (anchors, database)
└── kmodel/                  - Additional models
```

### Key Components

#### 1. FaceDetApp (Face Detection)
- **Model:** `face_detection_320.kmodel`
- **Input:** 320x320 RGB
- **Output:** Bounding boxes + Facial landmarks (5 points)
- **Preprocessing:** Pad + Resize (letterbox)
- **Post-processing:** NMS, confidence threshold

#### 2. FaceRegistrationApp (Feature Extraction)
- **Model:** `face_recognition.kmodel` or `face_recognition_mobile.kmodel`
- **Input:** 112x112 aligned face (via affine transform)
- **Output:** 128-dim feature vector
- **Alignment:** Umeyama algorithm with 5 facial landmarks

#### 3. FaceRecognition (Main System)
```python
class FaceRecognition:
    - database_init()      # Load .bin features from /sdcard/examples/utils/db/
    - database_search()    # Compare feature with DB (cosine similarity)
    - run()                # Detect → Extract features → Search
```

### Database Structure
- **Location:** `/sdcard/examples/utils/db/`
- **Format:** `ID001.bin`, `ID002.bin`, ...
- **Content:** 128 float values (feature vector)
- **Max faces:** 100

### Models Used
| Model | Path | Input Size | Purpose |
|-------|------|------------|---------|
| Face Detection | `/sdcard/examples/kmodel/face_detection_320.kmodel` | 320x320 | Detect faces + landmarks |
| Face Recognition | `/sdcard/examples/kmodel/face_recognition.kmodel` | 112x112 | Extract 128-dim features |
| Face Recognition Lite | `/sdcard/examples/kmodel/face_recognition_mobile.kmodel` | 112x112 | Lightweight version |

### Thresholds
- **Detection confidence:** 0.3-0.5
- **NMS threshold:** 0.2
- **Recognition threshold:** 0.75 (cosine similarity)

### Integration with MQTT

```python
# In main.py - when face ID changes:
if current_recognized_id != last_recognized_id:
    person_id_str = f"ID{current_recognized_id}"

    # 1. Send image
    img_jpg = img_ai.to_jpeg(quality=70)
    mqtt_client.publish_image(person_id_str, img_jpg)

    # 2. Send data
    mqtt_client.publish_data(person_id_str, "yes")
```

### Hardware Button Controls
- **Short press (< 1.5s):** Next target ID
- **Long press (> 1.5s):** Save current face to database

### CanMV/K230 Specific
- **Dual channel camera:**
  - CHN_ID_0: Display (RGB888)
  - CHN_ID_2: AI processing (RGBP888, 16-byte aligned)
- **AI2D:** Hardware accelerator for preprocessing (pad, resize, affine)
- **Display:** ST7701 (640x480)
- **Sensor:** RGB888 / RGBP888 formats

### Dependencies
```python
from libs.PipeLine import PipeLine
from libs.AIBase import AIBase
from libs.AI2D import Ai2d
from libs.Utils import *
import umqtt_simple        # MQTT
import ulab.numpy as np    # NumPy compatible
import aidemo              # C extension for post-processing
import nncase_runtime as nn
```

### File Integration: main.py + mqtt_client.py

**main.py** includes:
- Face detection & recognition classes
- Camera sensor setup (dual channel)
- Display handling
- Hardware button handler
- MQTT integration (publish on ID change)

**mqtt_client.py** provides:
- `MQTTClient` class wrapper
- `publish_image(person_id, image_bytes)` - Base64 encoded
- `publish_data(person_id, data="yes")` - Data notification

**Can they work together?** YES - Already integrated!
- main.py imports: `from mqtt_client import MQTTClient`
- MQTT publishes only when recognized ID changes (prevents spam)
- Image resized to 160x120 before sending for speed

### Registration Flow
1. Place face in front of camera
2. Press button to select target ID
3. Long press to save face feature
4. Feature saved as `.bin` file
5. Next detection will match against saved features
