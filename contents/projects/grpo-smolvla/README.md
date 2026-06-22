name | GRPO-Based Reinforcement Learning for Flow-Matching VLA Models
name_th | GRPO Reinforcement Learning สำหรับโมเดล VLA แบบ Flow-Matching
description | An experiment using GRPO to teach a SmolVLA robot policy to improve itself through trial and error.

A class research project that adapts GRPO — the reinforcement-learning algorithm behind today's reasoning models — to SmolVLA, a flow-matching vision-language-action model. The policy acts inside a simulated manipulation environment, and the reward from each rollout is meant to push behavior past what supervised imitation alone can reach. Marked as a failed experiment: training was bottlenecked by CPU-only simulation, which made rollouts too slow for the policy to converge.
description_th | การทดลองใช้ GRPO เทรนระบบควบคุมหุ่นยนต์ SmolVLA ให้เรียนรู้และพัฒนาทักษะผ่านการลองผิดลองถูก

โปรเจกต์วิจัยในชั้นเรียนที่ลองหยิบ GRPO ซึ่งเป็นอัลกอริทึม Reinforcement Learning เบื้องหลังโมเดล Reasoning ยุคใหม่ มาปรับใช้กับ SmolVLA ซึ่งเป็นโมเดล Vision-Language-Action แบบ Flow-Matching เพื่อควบคุมหุ่นยนต์ในสภาพแวดล้อมจำลองให้ทำภารกิจหยิบจับสิ่งของ โดยตั้งใจใช้คะแนน Reward จากการทดลองแต่ละครั้งมาไกด์พฤติกรรมของหุ่นยนต์ให้ฉลาดกว่าการเรียนรู้จากข้อมูลเลียนแบบเพียงอย่างเดียว อย่างไรก็ตามการทดลองนี้ยังไม่ประสบความสำเร็จเนื่องจากติดคอขวดที่ระบบจำลองทำงานบน CPU เท่านั้น ส่งผลให้ขั้นตอน Rollout ช้าเกินกว่าที่ตัวโมเดลจะลู่เข้าหาคำตอบที่ถูกต้อง
extradetail | An experimental pairing of GRPO (DeepSeek-style RL) with a flow-matching VLA policy — still rare in published robotics work. Touches the full embodied-AI stack: policy modeling, simulation rollouts, and reward-driven fine-tuning.
extradetail_th | บุกเบิกการทดลองนำ GRPO สไตล์ DeepSeek มาผสานเข้ากับนโยบาย VLA แบบ Flow-Matching ซึ่งยังเป็นแนวทางที่พบได้น้อยในงานวิจัยด้านหุ่นยนต์ ได้จับงานสาย Embodied AI ครบวงจร ทั้งการดีไซน์โมเดล การทำ Simulation Rollout และการ Fine-tune ด้วย Reward
year | 2026
paper | /papers/fra503-grpo-smolvla.pdf
tags | reinforcement-learning, robotics, vla, research
