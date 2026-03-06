import JoditEditor from 'jodit-react'
import { memo } from 'react'

const editor =  function Home(Props:any) {
  return (<>
    <JoditEditor

      value={Props.description}
      config={{
        disabled:Props.disabled,
        askBeforePasteHTML:false,
        readonly: (Props.itemType == 'home' || Props.itemType=='brand') ? true : false,
        buttons: [
          'source', '|',
          'bold', 'italic', 'underline', 'strikethrough', '|',
          'ul', 'ol', '|',
          'font', 'fontsize', 'brush', 'paragraph', '|',
          'image', 'video', 'table', 'link', '|',
          'align', 'undo', 'redo', '|',
          'hr'
        ]
      }}
      tabIndex={1} // tabIndex of textarea
      onChange={(newContent) => {
        Props.getAuditScoreOnChange(Props.name, Props.targetKeyword, Props.titleTag, Props.metaDescription, newContent, Props.primaryImageAltText, Props.url)
      }}
      onBlur={(newContent) => {
        Props.setDescription(newContent)
      }}
    />
  </>)
}

export default memo(editor)