name | MADX — Multiplayer AI Diffusion eXperience
description | A multiplayer diffusion game engine where the player actually plays inside the model, not a program.

An experiment inspired by GameNGen (DOOM running inside a diffusion model). MADX is a diffusion-based world model trained on trajectories collected from multiple agents interacting in an environment (currently ATARI Boxing). Instead of rendering a hand-coded game, the model generates the next frame conditioned on both players' actions, turning a learned simulator into a real, two-player game — the game world is the neural network itself. Ships with public code.
description_th | เกมเอนจินแนวคิดใหม่ในรูปแบบ Diffusion World Model ที่ผู้เล่นได้เข้าไปโลดแล่นอยู่ในตัวโมเดลจริง ๆ

การทดลองสร้างสรรค์ที่ได้รับแรงบันดาลใจจาก GameNGen ที่รันเกม DOOM ในโมเดล Diffusion โดย MADX คือ Diffusion World Model ที่ฝึกฝนจากชุดข้อมูลเส้นทางการเคลื่อนที่ (Trajectory) ของหลากหลาย Agent ที่โต้ตอบกันในสภาพแวดล้อมจำลอง ซึ่งปัจจุบันทดสอบกับเกม ATARI Boxing แทนที่จะเรนเดอร์ภาพกราฟิกจากโค้ดเกมที่เขียนขึ้นมา ตัวโมเดลนี้จะทำหน้าที่เจเนอเรตเฟรมถัดไปโดยอิงจากการเคลื่อนไหวและการตอบสนองของผู้เล่นทั้งสองฝั่ง เปลี่ยนสภาพแวดล้อมจำลองแบบเรียนรู้ได้ให้กลายเป็นเกมสำหรับสองผู้เล่นอย่างแท้จริง โดยโลกในเกมทั้งหมดขับเคลื่อนด้วย Neural Network พร้อมเปิดโค้ดเป็นสาธารณะ
github | https://github.com/BetterACS/madx
year | 2025
extradetail | A working, playable world model rather than an offline benchmark. Brings together diffusion modeling, multi-agent data collection, and real-time interactive generation, with open-source code on GitHub.
extradetail_th | พัฒนา World Model ที่เล่นได้จริงและตอบสนองได้แบบเรียลไทม์ ไม่ใช่แค่โมเดลสำหรับทดสอบออฟไลน์ รวมเทคนิคการสร้างโมเดล Diffusion การเก็บข้อมูลแบบ Multi-agent และการสร้างภาพแบบโต้ตอบทันที พร้อมแจกโค้ดโอเพนซอร์สบน GitHub
tags | diffusion-models, reinforcement-learning, world-models, game-dev
