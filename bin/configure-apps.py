#!/usr/bin/env python3
import os
import xml.etree.ElementTree as ET
import configparser

def update_xml_config(filepath, url_base):
    print(f"Configuring {filepath}...")
    dir_name = os.path.dirname(filepath)
    if not os.path.exists(dir_name):
        os.makedirs(dir_name, exist_ok=True)
    
    if os.path.exists(filepath):
        try:
            tree = ET.parse(filepath)
            root = tree.getroot()
        except Exception as e:
            print(f"Error parsing XML {filepath}, creating new config. Error: {e}")
            root = ET.Element("Config")
            tree = ET.ElementTree(root)
    else:
        root = ET.Element("Config")
        tree = ET.ElementTree(root)

    # Set UrlBase
    url_base_el = root.find("UrlBase")
    if url_base_el is None:
        url_base_el = ET.SubElement(root, "UrlBase")
    url_base_el.text = url_base

    # Set AuthenticationMethod
    auth_method_el = root.find("AuthenticationMethod")
    if auth_method_el is None:
        auth_method_el = ET.SubElement(root, "AuthenticationMethod")
    auth_method_el.text = "External"

    # Set AuthenticationRequired
    auth_req_el = root.find("AuthenticationRequired")
    if auth_req_el is None:
        auth_req_el = ET.SubElement(root, "AuthenticationRequired")
    auth_req_el.text = "Enabled"

    if hasattr(ET, 'indent'):
        ET.indent(tree, space="  ", level=0)

    try:
        tree.write(filepath, encoding="utf-8", xml_declaration=True)
        print(f"Successfully configured {filepath}")
    except Exception as e:
        print(f"Failed to write config {filepath}: {e}")

def update_ini_config(filepath, section, option, value):
    print(f"Configuring {filepath}...")
    dir_name = os.path.dirname(filepath)
    if not os.path.exists(dir_name):
        os.makedirs(dir_name, exist_ok=True)

    config = configparser.ConfigParser()
    if os.path.exists(filepath):
        config.read(filepath)

    if not config.has_section(section):
        config.add_section(section)
        
    config.set(section, option, value)

    try:
        with open(filepath, 'w') as f:
            config.write(f)
        print(f"Successfully configured {filepath}")
    except Exception as e:
        print(f"Failed to write config {filepath}: {e}")

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    radarr_path = os.path.join(base_dir, "docker-config", "radarr", "config.xml")
    sonarr_path = os.path.join(base_dir, "docker-config", "sonarr", "config.xml")
    prowlarr_path = os.path.join(base_dir, "docker-config", "prowlarr", "config.xml")
    bazarr_path = os.path.join(base_dir, "docker-config", "bazarr", "config.ini")

    update_xml_config(radarr_path, "/radarr")
    update_xml_config(sonarr_path, "/sonarr")
    update_xml_config(prowlarr_path, "/prowlarr")
    
    update_ini_config(bazarr_path, "General", "base_url", "/bazarr")
