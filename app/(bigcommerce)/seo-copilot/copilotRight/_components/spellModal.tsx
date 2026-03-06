import { Api } from "@/app/_api/apiCall"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Button, Modal, Spinner } from "react-bootstrap"
import { basePath, images } from "@/next.config"
import Image from "next/image"
import { Pagination } from 'rsuite';
import { toast } from "react-toastify"

export default function Home(Props: any) {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [spell, setSpell] = useState([])
  const [ignoredSpell, setIgnoredSpell] = useState([])
  const [showSpellMaster, setShowSpellMaster] = useState(false)
  const [spellMaster, setSpellMaster] = useState([])
  const [currentPage, setCurrentPage] = useState<any>(1)
  const [total, setTotal] = useState(1)


  const [spellErrorCount, setSpellErrorCount] = useState(Props.count)


  useEffect(() => {
    setSpellErrorCount(Props.count)
  }, [Props.count])

  const [userInputSpell, setUserInputSpell] = useState('')

  const getItemIssueDetails = () => {
    setLoading(true)
    Api('getItemIssueDetails', {
      id: Props.id,
      type: 'content_issues',
      item_name: Props.itemName,
      target_keyword: Props.targetKeyword,
      title_tag: Props.titleTag,
      meta_description: Props.metaDescription,
      description: Props.description,
    }).then(({ data }) => {
      setLoading(false)
      const incorrectSpell: any = getDuplicateSpellCount(data.detailsData.spell_incorrect)
      const ignoredSpell: any = getDuplicateSpellCount(data.detailsData.spell_ignored)
      setSpell(incorrectSpell)
      setIgnoredSpell(ignoredSpell)
    })
  }

  const addIgnoreSpell = (spell: String, spellCount: any) => {
    setLoading(true)
    Api('addIgnoreSpell', { seo_audit_id: Props.id, spell: spell, is_last_spell: spellErrorCount - spellCount }).then(() => {
      Props.getAuditScoreOnChange()
      setSpellErrorCount((prev: any) => prev - spellCount)
      getItemIssueDetails()
      getAllErrorSpell()
    })
  }

  const removeIgnoreSpell = (spell: String, spellCount: any) => {
    setLoading(true)
    Api('removeIgnoreSpell', { seo_audit_id: Props.id, spell: spell, is_last_spell: spellErrorCount + spellCount }).then(() => {
      Props.getAuditScoreOnChange()
      setSpellErrorCount((prev: any) => prev + spellCount)
      getItemIssueDetails()
      getAllErrorSpell()
    })
  }

  const getDuplicateSpellCount = (spellArray: any) => {
    const spellCounts: any = {};
    spellArray.forEach((spellObj: any) => {
      const spell = spellObj.spell;
      spellCounts[spell] = (spellCounts[spell] || 0) + 1;
    });
    const spellCountArray = Object.keys(spellCounts).map(spell => ({
      spell,
      count: spellCounts[spell]
    }));
    return spellCountArray
  }

  const getAllErrorSpell = () => {
    Api('getAllErrorSpell', { page: currentPage, search_key: '' }).then((data) => {
      setSpellMaster(data.spellList.data)
      setTotal(data.spellList.total_count)
    })
  }

  const addSpellingByUser = () => {
    if (userInputSpell) {
      Api('addSpellingByUser', { spell: userInputSpell }).then(() => {
        setUserInputSpell('')
        toast.success('Spell saved.')
        getAllErrorSpell()
      })
    } else {
      toast.error('Enter spell.')
    }

  }

  useEffect(() => {
    getAllErrorSpell()
  }, [showSpellMaster, currentPage])

  useEffect(() => {
    setShowSpellMaster(false)
  }, [Props.show])

  useEffect(() => {
    Props.updateSpellCount(spellErrorCount)
  }, [spellErrorCount])

  let sno = 0

  return (<>
    <Modal show={Props.show} onHide={Props.onHide} centered={true} size="lg" onShow={getItemIssueDetails}>
      <Modal.Header closeButton={true}>
        {showSpellMaster &&
          <button className="btn btn-default" onClick={() => setShowSpellMaster(false)}><Image src={`${basePath}/images/back-icon.svg`} width={20} height={20} alt="" /></button>
        }
        <h1 className="m-1">{showSpellMaster ? 'Spelling Errors Setting' : 'Spelling Errors'}</h1>
        {!showSpellMaster &&
          <button className="btn btn-default" onClick={() => setShowSpellMaster(true)}><Image src={`${basePath}/images/setting-icon.svg`} width={20} height={20} alt="" /></button>
        }

      </Modal.Header>
      <Modal.Body>
        {showSpellMaster &&
          <div className="row mb-3">
            <div className="col-md-6">
              <input className="form-control" type="text" value={userInputSpell} onChange={(e) => setUserInputSpell(e.target.value)} />
            </div>
            <div className="col-md-6">
              <button className="custom-btn" onClick={addSpellingByUser}>{`Add Spelling to Store's Dictionary`}</button>
            </div>
          </div>}

        <div className="custom-table keywordSuggestion-table">
          {loading ? <Spinner size="sm" /> :
            (showSpellMaster == false) ?
              <table className="table">
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>Spelling Errors</th>
                    <th>Count</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {spell.map((item: any, key) => {
                    sno = sno + 1
                    return (
                      <tr key={key}>
                        <td>{sno}</td>
                        <td>{item.spell}</td>
                        <td>{item.count}</td>
                        <td><button className="custom-btn" onClick={() => addIgnoreSpell(item.spell,item.count)}>Ignore it</button></td>
                      </tr>)
                  })}

                  {ignoredSpell.map((item: any, key) => {
                    sno = sno + 1
                    return (
                      <tr key={key}>
                        <td>{sno}</td>
                        <td>{item.spell}</td>
                        <td>{item.count}</td>
                        <td><span className="badge">Ignored</span><button className="custom-btn" onClick={() => removeIgnoreSpell(item.spell,item.count)}>Undo Ignore</button></td>
                      </tr>)
                  })}
                </tbody>
              </table> :
              <>

                <table className="table">
                  <thead>
                    <tr>
                      <th>S.No.</th>
                      <th>Spelling Errors</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {spellMaster.map((item: any, key) => {

                      return (
                        <tr key={key}>
                          <td>{key + 1 + ((currentPage - 1) * 10)}</td>
                          <td>{item.spell}</td>
                          <td>
                            {(item.is_ignore == 'yes') ?
                              <><span className="badge">Ignored</span><button className="custom-btn" onClick={() => removeIgnoreSpell(item.spell,item.count)}>Undo Ignore</button></>
                              :
                              <button className="custom-btn" onClick={() => addIgnoreSpell(item.spell,item.count)}>Ignore it</button>
                            }

                          </td>
                        </tr>)
                    })}


                  </tbody>
                </table>
              </>
          }
        </div>


        {showSpellMaster &&
          <div className="mt-3">
            <Pagination total={total} limit={10} limitOptions={[5, 10, 20]} prev={true} next={true} first={true} last={true}
              layout={['pager', 'skip', '-']}
              maxButtons={4}
              ellipsis={true}
              boundaryLinks={true}
              activePage={Number(currentPage)}
              onChangePage={(page) => {
                setCurrentPage(page)
              }}
            />
          </div>}
      </Modal.Body>
    </Modal >
  </>)
}