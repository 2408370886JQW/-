import os
import zipfile
import sys

def zip_folder_with_encoding(source_dir, output_filename, encoding='gbk'):
    """
    Zips a folder with specified encoding for filenames to ensure compatibility on Windows (GBK).
    """
    with zipfile.ZipFile(output_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            for file in files:
                file_path = os.path.join(root, file)
                # Calculate relative path for archive
                rel_path = os.path.relpath(file_path, source_dir)
                
                # Add file to zip
                # Note: Python's zipfile module stores filenames as bytes if we pass them as bytes
                # This is the trick to force specific encoding for legacy zip extractors
                try:
                    # Try to encode the relative path to the target encoding (e.g., gbk for Windows Chinese)
                    arcname = rel_path.encode(encoding)
                except UnicodeEncodeError:
                    # Fallback to utf-8 if gbk fails (unlikely for standard Chinese chars)
                    print(f"Warning: Could not encode {rel_path} to {encoding}, using utf-8")
                    arcname = rel_path.encode('utf-8')
                
                # We need to manually create ZipInfo to set the filename as bytes
                zinfo = zipfile.ZipInfo.from_file(file_path, arcname=rel_path) # Use string for internal object
                
                # BUT, to force the encoding for the file header on disk:
                # The standard library doesn't easily support writing non-utf8/cp437 headers unless we use the flag_bits.
                # However, a simpler way that often works for modern Windows is just using standard UTF-8 but ensuring the flag is set.
                # Python 3 zipfile sets the UTF-8 flag (0x800) automatically if the filename is unicode.
                # If the user's system is VERY old or has specific locale issues, we might need CP936 (GBK).
                
                # Let's try the standard approach first but verify the file names are correct in the source.
                # The previous issue might have been double-encoding or filesystem issues.
                # Actually, the most robust way for cross-platform Chinese zip is to use standard UTF-8
                # and rely on modern unzippers. BUT if the user sees "empty/garbled", their unzipper might be expecting GBK.
                
                # Strategy: We will create a zip where filenames are stored as bytes in GBK encoding.
                # This is non-standard but works for Windows built-in extractor in Chinese locale.
                
                zinfo = zipfile.ZipInfo(filename=rel_path)
                zinfo.compress_type = zipfile.ZIP_DEFLATED
                
                # Override filename with bytes in GBK
                # This is a bit hacky but often necessary for "luanma" issues
                # In Python 3.11+, ZipInfo.filename is expected to be str usually, 
                # but we want to force raw bytes for the header.
                # We can bypass the internal check by monkey-patching or using a custom ZipInfo subclass,
                # OR we can just write the file using the standard method but pre-encode the name?
                # No, standard method forces UTF-8 if it sees non-ascii.
                
                # Let's try a different approach:
                # We use the standard writestr but we pass the encoded bytes as the arcname?
                # No, writestr expects str or ZipInfo.
                
                # Correct approach for Python 3 to force specific encoding:
                # We must subclass ZipInfo or modify the instance after creation such that _encodeFilenameFlags returns what we want.
                
                # Actually, simply setting zinfo.filename to the original string, 
                # but then manually setting the flag_bits to 0 (NOT 0x800) 
                # AND ensuring that when it writes, it encodes using our desired encoding.
                # But zipfile module is hardcoded to use utf-8 if flag is set, or ascii if not.
                # If we pass a string with Chinese chars, it sets the flag to 0x800 automatically.
                
                # Workaround:
                # We can pass the filename as 'bytes' to the constructor? 
                # No, constructor expects str.
                
                # Let's use a simpler method: 
                # Just use the standard zip command with -O gbk if available? 
                # No, we are in a python script.
                
                # Let's try to just use the standard zipfile but with a trick:
                # We encode the filename to GBK bytes, then decode it as Latin-1 (which maps bytes 1-1 to chars).
                # This way, zipfile thinks it's a string of weird chars, but the bytes are exactly the GBK bytes.
                # And we must ensure the UTF-8 flag is NOT set.
                
                gbk_bytes = rel_path.encode('gbk')
                latin1_str = gbk_bytes.decode('latin-1')
                
                zinfo = zipfile.ZipInfo(filename=latin1_str)
                zinfo.compress_type = zipfile.ZIP_DEFLATED
                zinfo.flag_bits = 0 # Ensure UTF-8 flag is OFF
                
                with open(file_path, 'rb') as f:
                    zipf.writestr(zinfo, f.read())
                    
    print(f"Successfully created {output_filename} with GBK encoding.")

if __name__ == "__main__":
    source = "/home/ubuntu/social-life-app/product_package"
    output = "/home/ubuntu/social-life-app/product_package_chinese.zip"
    
    if not os.path.exists(source):
        print(f"Error: Source directory {source} does not exist.")
        sys.exit(1)
        
    zip_folder_with_encoding(source, output)
