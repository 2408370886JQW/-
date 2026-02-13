import os
from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        pass

    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

def create_pdf(source_dir, output_filename, font_path):
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    
    # Add Chinese font
    # Note: fpdf2 supports .ttc files directly in recent versions, or we might need to use a specific index.
    # If .ttc fails, we might need to extract .ttf or use a different font.
    # Let's try adding it directly.
    try:
        pdf.add_font('ChineseFont', '', font_path)
    except Exception as e:
        print(f"Error loading font: {e}")
        return

    pdf.add_page()
    pdf.set_font("ChineseFont", size=24)
    pdf.cell(0, 20, txt="产品交互原型评审文档", ln=True, align='C')
    pdf.set_font("ChineseFont", size=12)
    pdf.cell(0, 10, txt="生成日期: 2026-02-13", ln=True, align='C')
    pdf.ln(20)

    # Define the order and Chinese names
    # We use the English folder names for file access, but display Chinese titles
    structure = {
        "01_Meet_Flow": {
            "title": "相见链路",
            "pages": [
                ("01_Relation_Selection", "相见页-01-关系选择"),
                ("02_Venue_List", "相见页-02-商家列表"),
                ("03_Venue_Detail", "相见页-03-商家详情"),
                ("04_Package_Selection", "相见页-04-套餐选择"),
                ("05_Payment", "相见页-05-支付页"),
                ("06_Payment_Success", "相见页-06-支付完成引导"),
                ("07_Order_Detail", "相见页-07-订单详情")
            ]
        },
        "02_Encounter_Flow": {
            "title": "偶遇链路",
            "pages": [
                ("01_Map_Home", "偶遇页-01-地图首页"),
                ("02_Filter_Modal", "偶遇页-02-筛选弹窗")
            ]
        },
        "03_Friends_Flow": {
            "title": "好友链路",
            "pages": [
                ("01_Friend_List", "好友页-01-列表模式")
            ]
        },
        "04_Moments_Flow": {
            "title": "动态链路",
            "pages": [
                ("01_Moments_Feed", "动态页-01-动态流"),
                ("02_Post_Moment", "动态页-02-发布动态")
            ]
        },
        "05_Messages_Flow": {
            "title": "消息链路",
            "pages": [
                ("01_Message_List", "消息页-01-消息列表")
            ]
        },
        "06_Profile_Flow": {
            "title": "我的链路",
            "pages": [
                ("01_Profile_Center", "我的页-01-个人中心")
            ]
        }
    }

    for folder_key, content in structure.items():
        # Add Section Header
        pdf.add_page()
        pdf.set_font("ChineseFont", size=18)
        pdf.cell(0, 15, txt=content["title"], ln=True, align='L')
        pdf.ln(5)
        
        for page_folder, page_title in content["pages"]:
            # Find the image
            # Note: We are looking in the product_package_en directory which has English folder names
            img_path = os.path.join(source_dir, folder_key, page_folder, "preview.png")
            
            if os.path.exists(img_path):
                pdf.set_font("ChineseFont", size=14)
                pdf.cell(0, 10, txt=page_title, ln=True)
                
                # Add Image
                # Center image
                pdf.image(img_path, x=65, w=80)
                pdf.ln(10)
            else:
                print(f"Warning: Image not found for {page_title} at {img_path}")

    pdf.output(output_filename)
    print(f"PDF generated: {output_filename}")

if __name__ == "__main__":
    source = "/home/ubuntu/social-life-app/product_package_en"
    output = "/home/ubuntu/social-life-app/产品交互原型评审文档_中文版.pdf"
    font = "/home/ubuntu/social-life-app/NotoSansSC-Regular.ttf"
    create_pdf(source, output, font)
