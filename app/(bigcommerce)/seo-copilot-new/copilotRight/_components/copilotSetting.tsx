"use client";
import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Image from "next/image";
import { basePath } from "@/next.config";

function CopilotSettingArea() {
  return (
    <>
      <div className="copilot-settingDropi">
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            <Image
              src={`${basePath}/images/setting-icon.svg`}
              alt=""
              width={20}
              height={20}
            />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </>
  );
}

export default CopilotSettingArea;
