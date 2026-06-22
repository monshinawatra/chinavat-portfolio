name | Payex — Payment Extraction
description | Reads a messy 7-Eleven receipt and returns clean, structured line items.

A computer-vision pipeline that extracts itemized information from convenience-store receipts by chaining several specialized models: Grounded-SAM for region detection, CRAFT for text localization, TrOCR for recognition, and an LLM to normalize the raw output into structured data. A practical document-understanding system assembled from modern multi-modal building blocks instead of forcing a single black box to do everything. Built at a time when ChatGPT still couldn't read text from images — so the pipeline had to do all the visual reading itself.
description_th | ระบบสแกนและดึงข้อมูลจากใบเสร็จ 7-Eleven ที่ยุ่งเหยิงให้กลายเป็นรายการสินค้าที่สะอาดและเป็นระเบียบ

พัฒนา Pipeline ด้าน Computer Vision เพื่อตรวจจับและดึงข้อมูลรายการสินค้าจากใบเสร็จร้านสะดวกซื้อ โดยการผสานการทำงานของโมเดลเฉพาะทางหลายตัวเข้าด้วยกัน เริ่มจาก Grounded-SAM สำหรับตรวจหาพื้นที่และขอบเขตวัตถุ CRAFT สำหรับระบุตำแหน่งข้อความ TrOCR สำหรับอ่านตัวอักษร และปิดท้ายด้วย LLM เพื่อจัดรูปแบบผลลัพธ์ดิบให้กลายเป็นข้อมูลที่มีโครงสร้างชัดเจน ถือเป็นระบบทำความเข้าใจเอกสาร (Document AI) ที่ใช้งานได้จริงจากการประกอบร่างเครื่องมือ Multi-modal ยุคใหม่เข้าด้วยกัน โดยโปรเจกต์นี้พัฒนาขึ้นตั้งแต่ช่วงที่ ChatGPT ยังไม่รองรับการอ่านข้อความจากภาพ ทำให้ต้องออกแบบระบบให้อ่านและประมวลผลภาพเองทั้งหมด
year | 2024
extradetail | Real-world document AI: composes four models (Grounded-SAM, CRAFT, TrOCR, LLM) into one robust pipeline. Shows systems thinking — picking and stitching the right tool at each stage of a noisy, real-input problem.
extradetail_th | สัมผัสงานสาย Document AI ของจริง ด้วยการเชื่อมต่อโมเดลถึง 4 ตัวประกอบด้วย Grounded-SAM CRAFT TrOCR และ LLM ให้ทำงานร่วมกันเป็น Pipeline เดียวได้อย่างเสถียร สะท้อนถึงการคิดเชิงระบบในการเลือกใช้และเชื่อมโยงเครื่องมือที่เหมาะสมเพื่อแก้ปัญหาจากข้อมูลอินพุตในโลกจริงที่มีสัญญาณรบกวนสูง
github | https://github.com/BetterACS/payment-extraction
tags | computer-vision, multimodal, ocr, llm
