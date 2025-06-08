'use client'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Grid, Typography, CardContent, Card } from '@mui/material'
import Script from 'next/script'
declare global {
  interface Window {
    go: any
  }
}
const ViewFlowComponent = () => {
  const [goLoaded, setGoLoaded] = useState(false)
  const diagramRef = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()

  // const [formDataId, setFormDataId] = useState<string | null>(null)

  useEffect(() => {
    console.log(searchParams.get('form_data_id'))
    if (!goLoaded || !window.go || !diagramRef.current) return
    const go = window.go
    const $ = go.GraphObject.make
    const myDiagram = $(go.Diagram, diagramRef.current, {
      initialContentAlignment: go.Spot.Center,
      layout: $(go.TreeLayout),
      'undoManager.isEnabled': true
    })

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
      $(go.Shape, { strokeWidth: 1.5 }),
      $(go.Shape, { toArrow: 'OpenTriangle' }),
      $(go.TextBlock, {
        font: '400 9pt Source Sans Pro, sans-serif',
        segmentOffset: new go.Point(NaN, 10)
      }).bindTwoWay('text')
    ).bindTwoWay('points')

    // === Load JSON model ===
    myDiagram.model = go.Model.fromJson({
      class: 'GraphLinksModel',
      pointsDigits: 1,
      linkFromPortIdProperty: 'fromPort',
      linkToPortIdProperty: 'toPort',
      modelData: {
        position: '-741.5 -310'
      },
      nodeDataArray: [
        {
          key: -1,
          text: 'Start',
          figure: 'Ellipse',
          category: 'start',
          components: '',
          location: '-350 -250',
          size: '75 75',
          fill: '#53D28C'
        },
        {
          key: -2,
          text: 'กรอกรายละเอียดแบบฟอร์ม 6006',
          figure: 'Rectangle',
          category: 'activity',
          components: '["1","2"]',
          location: '-350 -150',
          form: 48,
          assignees_requestor: true
        },
        {
          key: -3,
          text: 'ผอ.สำนัก ตรวจสอบ และ ลงนาม',
          figure: 'Rectangle',
          category: 'activity',
          components: '["1","2"]',
          location: '-350 -30',
          assignees_user: [2020]
        },
        {
          key: -4,
          text: 'ผส.คลังตรวจสอบ',
          figure: 'Rectangle',
          category: 'activity',
          components: '["1","2"]',
          location: '-350 100',
          assignees_user: [2021]
        },
        {
          key: -5,
          text: 'จนท. ลงนามรับเงิน',
          figure: 'Rectangle',
          category: 'activity',
          components: '["1","2"]',
          location: '-350 220',
          assignees_requestor: true
        },
        {
          key: -6,
          text: 'End',
          figure: 'Ellipse',
          category: 'end',
          components: '',
          location: '-350 330',
          size: '75 75',
          fill: '#CE0620'
        }
      ],
      linkDataArray: [
        {
          key: 0,
          toPort: 'T',
          fromPort: 'B',
          from: -1,
          to: -2,
          points: [-350, -212.5, -350, -202.5, -350, -198, -350, -198, -350, -193.5, -350, -183.5],
          text: '',
          signId: ''
        },
        {
          key: 0,
          toPort: 'T',
          fromPort: 'B',
          from: -2,
          to: -3,
          points: [-350, -116.5, -350, -106.5, -350, -90, -350, -90, -350, -73.5, -350, -63.5],
          text: 'บันทึก',
          signId: 'SignRequestorS1'
        },
        {
          key: 0,
          toPort: 'T',
          fromPort: 'B',
          from: -3,
          to: -4,
          points: [-350, 3.5, -350, 13.5, -350, 35, -350, 35, -350, 56.5, -350, 66.5],
          text: 'ลงนาม',
          signId: 'SignDirOfficeInspectS2'
        },
        {
          key: 0,
          toPort: 'T',
          fromPort: 'B',
          from: -4,
          to: -5,
          points: [
            -350, 133.53891601562498, -350, 143.53891601562498, -350, 160, -350, 160, -350, 176.461083984375, -350,
            186.461083984375
          ],
          text: 'จ่ายเงิน',
          signId: 'SignDirTreasuryAuditS3'
        },
        {
          key: 0,
          toPort: 'T',
          fromPort: 'B',
          from: -5,
          to: -6,
          points: [
            -350, 253.53891601562498, -350, 263.538916015625, -350, 273.0194580078125, -350, 273.0194580078125, -350,
            282.5, -350, 292.5
          ],
          text: 'ยืนยันการรับเงิน',
          signId: 'SignRequestorS4'
        },
        {
          key: 0,
          toPort: 'R',
          fromPort: 'R',
          from: -4,
          to: -2,
          points: [-280.5, 100, -270.5, 100, -232.3, 100, -232.3, -25, -232.3, -150, -242.3, -150],
          text: 'ส่งกลับเจ้าของเรื่อง',
          signId: ''
        }
      ]
    })
  }, [goLoaded])

  return (
    <Grid container spacing={6}>
      <Script src='/lib/go.js' strategy='afterInteractive' onLoad={() => setGoLoaded(true)} />
      <Grid item xs={12}>
        <Card>
          <CardContent className='min-h-[calc(100vh-160px)] flex flex-col gap-4'>
            <Typography variant='h5'>เวิร์กโฟลว์</Typography>
            <div ref={diagramRef} style={{ flexGrow: 1, border: '1px solid black' }} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default ViewFlowComponent
