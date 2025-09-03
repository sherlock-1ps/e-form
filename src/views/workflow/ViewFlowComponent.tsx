'use client'
import { useEffect, useRef, useState, useCallback } from 'react' // เพิ่ม useCallback
import { useSearchParams } from 'next/navigation'
import { Grid, Typography, CardContent, Card, Button } from '@mui/material'
import Script from 'next/script' // ไม่ได้ใช้ Script component นี้ในโค้ด
import { useViewFlowOption } from '@/queryOptions/form/formQueryOptions'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { toast } from 'react-toastify'

declare global {
  interface Window {
    go: any
    myDiagram: any
    flowAnimation?: ReturnType<typeof setInterval>
  }
}

const ViewFlowComponent = ({ formDataId, onBack, noBack = false }: any) => {
  const [goLoaded, setGoLoaded] = useState(false)
  const diagramRef = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()

  const { mutateAsync: callViewFlow } = useViewFlowOption()

  // ใช้ useCallback ห่อ fetchData
  const fetchData = useCallback(async () => {
    // ตรวจสอบ myDiagram ก่อนใช้งาน เพื่อให้แน่ใจว่าถูกสร้างแล้ว
    if (!window.myDiagram) {
      console.warn('myDiagram is not yet initialized when fetchData is called.')
      return
    }

    const form_data_id = parseInt(formDataId || '0')

    try {
      const response = await callViewFlow({ form_data_id })

      console.log('response', response)

      window.myDiagram.model = window.go.Model.fromJson(response.result.data.flow)

      function changeNodeColorByKey(key: any, newColor: string) {
        const node = window.myDiagram.findNodeForKey(key)
        console.log('key', key, newColor)

        if (node) {
          window.myDiagram.model.startTransaction('change node color')
          window.myDiagram.model.setDataProperty(node.data, 'fill', newColor)
          window.myDiagram.model.commitTransaction('change node color')
        }
      }

      const green = '#53D28C'
      const blue = '#2c9afc'
      let nodeColor = '#fff'
      const formDataDetails = response?.result?.data?.form_data_detail ?? []
      // console.log('formDataDetails', formDataDetails)
      let lastId = 0

      // window.myDiagram.links.each(function (link: any) {
      //   if (link?.fromNode?.data?.key === -1) {
      //     lastId = link.data.to
      //     window.myDiagram.model.setDataProperty(link.data, 'color', green)
      //   }

      //   for (const element of formDataDetails) {
      //     // console.log('link?.toNode?.data?.key', link?.toNode?.data?.key)
      //     lastId = element.link_to

      //     if (link?.toNode?.data?.key === element?.link_to) {
      //       console.log('link?.toNode?.data?.key === element?.link_to)', link?.toNode?.data?.key, element?.link_to)
      //       changeNodeColorByKey(link.fromNode.data.key, green)
      //       window.myDiagram.model.setDataProperty(link?.data, 'color', green)
      //     }
      //   }
      // })

      for (const element of formDataDetails) {
        lastId = element.link_to

        changeNodeColorByKey(element.link_from, green)
        // window.myDiagram.model.setDataProperty(link?.data, 'color', green)
      }

      function getNode(key: any) {
        return window.myDiagram.findNodeForKey(key)
      }

      let newColor = blue
      let countRunning = 0
      clearInterval(window.flowAnimation)
      const node = getNode(lastId)

      nodeColor = node?.data?.fill || '#fff'
      window.flowAnimation = setInterval(() => {
        changeNodeColorByKey(lastId, newColor)
        if (newColor == blue) {
          newColor = nodeColor
        } else {
          newColor = blue
        }
        countRunning++
        if (countRunning == 51) {
          clearInterval(window.flowAnimation)
        }
      }, 1000)

      console.log('flow', response.result)
    } catch (error) {
      console.error('Error fetching flow data:', error)
      toast.error('เกิดข้อผิดพลาดในการดึงข้อมูล', { autoClose: 3000 })
    }
  }, [formDataId, callViewFlow]) // Dependencies สำหรับ useCallback: formDataId และ callViewFlow

  // useEffect สำหรับการสร้าง Diagram และเรียก fetchData
  useEffect(() => {
    if (!goLoaded || !window.go || !diagramRef.current) return
    // ตรวจสอบว่า myDiagram ถูกสร้างแล้วหรือยัง เพื่อป้องกันการสร้างซ้ำ
    if (window?.go?.Diagram?.fromDiv(diagramRef.current)) {
      // หาก myDiagram มีอยู่แล้ว ให้เรียก fetchData ใหม่เท่านั้น
      // เพื่ออัปเดตข้อมูลบน Diagram ที่มีอยู่แล้ว
      fetchData()
      return
    }

    const go = window.go
    const $ = go.GraphObject.make
    const myDiagram = $(go.Diagram, diagramRef.current, {
      initialContentAlignment: go.Spot.Center,
      layout: $(go.TreeLayout),
      'undoManager.isEnabled': true
    })
    window.myDiagram = myDiagram

    const findImgPath = (pic: string) => `./img/${pic}.svg`
    const jsonParse = (data: string) => JSON.parse(data)

    const imgDisplay = $(go.Panel, go.Panel.Table, {
      background: 'transparent',
      cursor: 'Pointer',
      column: 0,
      height: 18,
      alignment: go.Spot.TopLeft
    }).add(
      $(go.Panel, go.Panel.Horizontal).add(
        $(go.Picture, {
          alignment: go.Spot.TopLeft,
          name: 'PICTURE',
          desiredSize: new go.Size(18, 18),
          source: './img/3.png'
        }).bind('source', findImgPath)
      )
    )

    const nodeTemplatePanel = (option: any, isEdit = true) =>
      $(go.Node, 'Spot', {
        locationSpot: go.Spot.Center,
        resizeObjectName: 'PANEL',
        isLayoutPositioned: false
      })
        .bindTwoWay('location', 'location', go.Point.parse, go.Point.stringify)
        .bindTwoWay('angle')
        .add(
          $(go.Panel, 'Auto', { name: 'PANEL' })
            .bindTwoWay('desiredSize', 'size', go.Size.parse, go.Size.stringify)
            .add(
              $(go.Shape, 'Rectangle', {
                portId: '',
                cursor: 'pointer',
                fill: 'white',
                strokeWidth: 2
              })
                .bind('figure')
                .bind('fill'),
              $(go.TextBlock, {
                font: 'bold 10pt Helvetica, Arial, sans-serif',
                margin: 8,
                maxSize: new go.Size(160, NaN),
                wrap: go.Wrap.Fit
              }).bindTwoWay('text')
            )
        )

    const nodeTemplatePanelActivity = (option: any, isEdit = true) =>
      $(go.Node, 'Spot', {
        locationSpot: go.Spot.Center,
        alignment: go.Spot.TopLeft,
        resizeObjectName: 'PANEL',
        isLayoutPositioned: false
      })
        .bindTwoWay('location', 'location', go.Point.parse, go.Point.stringify)
        .bindTwoWay('angle')
        .add(
          $(go.Panel, 'Auto', { name: 'PANEL' })
            .bindTwoWay('desiredSize', 'size', go.Size.parse, go.Size.stringify)
            .add(
              $(go.Shape, 'Rectangle', {
                alignment: go.Spot.TopLeft,
                portId: '',
                cursor: 'pointer',
                fill: 'white',
                strokeWidth: 2
              })
                .bind('figure')
                .bind('fill'),
              $(go.Panel, go.Panel.Table, { margin: 0.5 }).add(
                $(go.Panel, go.Panel.Table, {
                  padding: new go.Margin(15, 18, 15, 18),
                  minSize: new go.Size(100, NaN)
                }).add(
                  $(go.Panel, go.Panel.Table, {
                    column: 0,
                    stretch: go.Stretch.Vertical,
                    defaultAlignment: go.Spot.Left
                  }).add(
                    $(go.Panel, go.Panel.Horizontal, { row: 0 }).add(
                      $(go.TextBlock, { minSize: new go.Size(10, 14) }).bindTwoWay('text')
                    )
                  )
                ),
                $(go.Panel, go.Panel.Table, {
                  row: 1,
                  padding: 1,
                  alignment: go.Spot.TopLeft,
                  defaultColumnSeparatorStrokeWidth: 0.5
                }).add(
                  $(go.Panel, 'Horizontal', {
                    row: 5,
                    itemTemplate: imgDisplay
                  }).bind('itemArray', 'components', jsonParse)
                )
              )
            )
        )

    const templmap = new go.Map()
    templmap.add('start', nodeTemplatePanel({}, false))
    templmap.add('condition', nodeTemplatePanel({}))
    templmap.add('end', nodeTemplatePanel({}, false))
    templmap.add('comment', nodeTemplatePanel({}))
    templmap.add('activity', nodeTemplatePanelActivity({}))

    myDiagram.nodeTemplateMap = templmap

    myDiagram.linkTemplate = $(
      go.Link,
      {
        routing: go.Routing.AvoidsNodes,
        curve: go.Curve.JumpOver,
        corner: 5
      },
      $(go.Shape, { strokeWidth: 1.5 }).bindTwoWay('stroke', 'color').bindTwoWay('fill', 'color'),
      $(go.Shape, { toArrow: 'OpenTriangle' }).bindTwoWay('stroke', 'color').bindTwoWay('fill', 'color'),
      $(go.TextBlock, {
        font: '400 9pt Source Sans Pro, sans-serif',
        segmentOffset: new go.Point(NaN, 10)
      }).bindTwoWay('text')
    ).bindTwoWay('points')

    fetchData() // เรียก fetchData หลังจาก myDiagram ถูกสร้างขึ้นแล้ว
  }, [goLoaded, formDataId, fetchData]) // เพิ่ม fetchData เป็น dependency

  // useEffect สำหรับโหลด GoJS script
  useEffect(() => {
    if (!window.go) {
      // ใช้ next/script แทนการสร้าง script เองถ้าทำได้ (แต่โค้ดปัจจุบันใช้สร้างเอง)
      // หากคุณไม่ได้ใช้ <Script> component จาก next/script ใน JSX
      // การโหลดด้วย DOM API ตรงๆ แบบนี้ก็ใช้งานได้
      loadScript('/lib/go.js')
        .then(() => {
          setGoLoaded(true)
        })
        .catch(() => {
          console.error('❌ Failed to load go.js')
          toast.error('ไม่สามารถโหลด script ได้', { autoClose: 3000 })
        })
    } else {
      setGoLoaded(true)
    }
  }, []) // ไม่มี formDataId เป็น dependency เพราะการโหลด script ไม่ได้ขึ้นอยู่กับมัน

  const loadScript = (src: any) => {
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script')
      script.src = src
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => reject()
      document.body.appendChild(script)
    })
  }

  // Cleanup effect เมื่อ component unmount เพื่อล้าง clearInterval
  useEffect(() => {
    return () => {
      if (window.flowAnimation) {
        clearInterval(window.flowAnimation)
        window.flowAnimation = undefined // Clear reference
      }
      // Optional: ถ้า myDiagram ยังคงมีอยู่และคุณต้องการล้างมัน
      // if (window.myDiagram && window.myDiagram.div === diagramRef.current) {
      //   window.myDiagram.div = null; // Detach from DOM
      //   window.myDiagram.clear(); // Clear model
      //   window.myDiagram.dispose(); // Dispose diagram
      //   window.myDiagram = null;
      // }
    }
  }, []) // รันครั้งเดียวเมื่อ mount และ cleanup เมื่อ unmount

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent className='min-h-[calc(100vh-20px)] flex flex-col gap-4'>
            <div className='flex gap-2 items-center'>
              {!noBack && (
                <Button
                  variant='contained'
                  startIcon={<ArrowBackIcon />}
                  onClick={() => {
                    onBack()
                  }}
                >
                  ย้อนกลับ
                </Button>
              )}
              <Typography variant='h5'>เวิร์กโฟลว์ปัจจุบัน</Typography>
            </div>
            <div ref={diagramRef} style={{ flexGrow: 1, border: '1px solid black' }} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default ViewFlowComponent
