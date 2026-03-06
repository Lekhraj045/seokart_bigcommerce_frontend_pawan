import Dropdown from 'react-bootstrap/Dropdown';
import Image from "next/image"
import { basePath } from "../../next.config.js"

export default function Home() {
  return (<>
    <div className="topHeader-menu">
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          <Image src={`${basePath}/images/hamburger-menu.svg`} alt="" width={16} height={14} />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item href={`${basePath}/upgrade?tab=app`}><Image src={`${basePath}/images/upgrade-icon.svg`} alt='' width={20} height={20} /> Upgrade</Dropdown.Item>
          <Dropdown.Item href={`${basePath}/upgrade?tab=seoServices`}><Image src={`${basePath}/images/seo-services-icon.svg`} alt='' width={20} height={20} /> SEO Services</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item href={`${basePath}/help?tab=faqs`}><Image src={`${basePath}/images/faqs-icon.svg`} alt='' width={20} height={20} /> FAQs</Dropdown.Item>
          <Dropdown.Item href={`${basePath}/help?tab=ask-an-expert`}><Image src={`${basePath}/images/ask-and-expert-icon.svg`} alt='' width={20} height={20} /> Ask an Expert</Dropdown.Item>
          <Dropdown.Item href={`${basePath}/help?tab=report-restore`}><Image src={`${basePath}/images/report-restore-icon.svg`} alt='' width={20} height={20} /> Report/Restore</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  </>)
}