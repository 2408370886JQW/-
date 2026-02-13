import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.units import mm

def create_pdf(source_dir, output_filename, font_path):
    c = canvas.Canvas(output_filename, pagesize=A4)
    width, height = A4
    
    # Register Chinese Font
    try:
        pdfmetrics.registerFont(TTFont('ChineseFont', font_path))
        font_name = 'ChineseFont'
    except Exception as e:
        print(f"Error registering font: {e}")
        return

    # Title Page
    c.setFont(font_name, 24)
    c.drawCentredString(width / 2, height - 100, "产品交互原型评审文档")
    c.setFont(font_name, 12)
    c.drawCentredString(width / 2, height - 130, "生成日期: 2026-02-13")
    c.showPage()

    # Structure
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
        # Section Header Page
        c.showPage() # Always start new section on new page
        c.setFont(font_name, 20)
        c.drawString(20 * mm, height - 40 * mm, content["title"])
        
        # Add Bookmark for Section
        key = content["title"]
        c.bookmarkPage(key)
        c.addOutlineEntry(content["title"], key, level=0, closed=False)
        
        y_pos = height - 60 * mm
        
        for page_folder, page_title in content["pages"]:
            # Check if we need a new page
            if y_pos < 50 * mm:
                c.showPage()
                c.setFont(font_name, 20)
                c.drawString(20 * mm, height - 40 * mm, content["title"] + " (续)")
                y_pos = height - 60 * mm

            img_path = os.path.join(source_dir, folder_key, page_folder, "preview.png")
            
            if os.path.exists(img_path):
                c.setFont(font_name, 14)
                c.drawString(20 * mm, y_pos, page_title)
                
                # Add Bookmark for Page
                page_key = page_title
                c.bookmarkPage(page_key)
                c.addOutlineEntry(page_title, page_key, level=1)
                
                # Draw Image
                # Scale image to fit width (e.g. 80mm wide)
                img_width = 80 * mm
                img_height = 170 * mm # Approx aspect ratio
                
                # If image is too tall for remaining space, new page
                if y_pos - img_height - 10 * mm < 0:
                     c.showPage()
                     c.setFont(font_name, 20)
                     c.drawString(20 * mm, height - 40 * mm, content["title"] + " (续)")
                     y_pos = height - 60 * mm
                     c.setFont(font_name, 14)
                     c.drawString(20 * mm, y_pos, page_title)

                c.drawImage(img_path, (width - img_width) / 2, y_pos - img_height - 5 * mm, width=img_width, height=img_height, preserveAspectRatio=True)
                
                y_pos -= (img_height + 20 * mm)
            else:
                print(f"Warning: Image not found for {page_title}")
        
        c.showPage()

    c.save()
    print(f"PDF generated: {output_filename}")

if __name__ == "__main__":
    source = "/home/ubuntu/social-life-app/product_package_en"
    output = "/home/ubuntu/social-life-app/产品交互原型评审文档_中文版.pdf"
    font = "/usr/share/fonts/truetype/droid/DroidSansFallbackFull.ttf"
    create_pdf(source, output, font)
