## Memory Rule

When important information appears:
- Save it into .claude/MEMORY.md
- Organize into correct section (user, project, feedback, reference)
- Do not store temporary data

---

## User

The user is working on embedded AI systems using CanMV/K230 platform. Focus on face recognition and IoT integration.

---

## Project

### my-oracle Project
- Face recognition system using CanMV/K230
- MQTT integration for remote alerts
- Located at: `j:\CodeAgent\my-oracle\`

### facericonition Project (Reference)
- Location: `j:\CodeAgent\facericonition\`
- Contains working face recognition examples
- main.py already integrates face_recognition + mqtt_client
- Ready to use as reference for my-oracle project

---

## Reference

### Face Recognition System Architecture

**File Integration:** YES - main.py and mqtt_client.py already work together

```python
# main.py imports mqtt_client
from mqtt_client import MQTTClient

# MQTT publishes when face ID changes:
if current_recognized_id != last_recognized_id:
    mqtt_client.publish_image(person_id_str, img_jpg)
    mqtt_client.publish_data(person_id_str, "yes")
```

**Key Files:**
- [main.py](j:/CodeAgent/facericonition/main.py) - Full integration example
- [mqtt_client.py](j:/CodeAgent/facericonition/mqtt_client.py) - MQTT wrapper class
- [face_recognition.py](j:/CodeAgent/facericonition/examples/05-AI-Demo/face_recognition.py) - Recognition system
- [face_registration.py](j:/CodeAgent/facericonition/examples/05-AI-Demo/face_registration.py) - Registration system

**MQTT Broker:** 178.128.49.254:1883
**Topics:** `RCN/IDXXXX/image`, `RCN/IDXXXX/DATA`
