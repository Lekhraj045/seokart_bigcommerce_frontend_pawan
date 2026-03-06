import { Tab, Nav } from "react-bootstrap";
import PageList from "./pageList";
import ErrorList from "./errorList";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const tab = searchParams?.get("tab") ?? "pages";

  return (
    <>
      <div className="card">
        <Tab.Container
          defaultActiveKey={tab}
          onSelect={(e: any) => {
            localStorage.setItem("seoOptimizerTab", e);
          }}
        >
          <Nav variant="tabs">
            <Nav.Item>
              <Nav.Link eventKey="pages" style={{ textDecoration: "none" }}>
                Pages
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="errors" style={{ textDecoration: "none" }}>
                Errors
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="pages">
              <PageList />
            </Tab.Pane>
            <Tab.Pane eventKey="errors">
              <ErrorList />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </>
  );
}
