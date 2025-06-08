'use client'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Grid, Typography, CardContent, Card, Button } from '@mui/material'
import Script from 'next/script'
import { useViewFlowOption } from '@/queryOptions/form/formQueryOptions'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { toast } from 'react-toastify'
declare global {
  interface Window {
    go: any
    myDiagram: any
  }
}

const ViewFlowComponent = ({ formDataId, onBack }: any) => {
  const [goLoaded, setGoLoaded] = useState(false)
  const diagramRef = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()

  // const [formDataId, setFormDataId] = useState<string | null>(null)
  const { mutateAsync: callViewFlow } = useViewFlowOption()
  const fetchData = async () => {
    // const form_data_id = parseInt(searchParams.get('form_data_id') || '0')
    const form_data_id = parseInt(formDataId || '0')

    const response = await callViewFlow({ form_data_id })
    window.myDiagram.model = window.go.Model.fromJson(response.result.data.flow)

    function changeNodeColorByKey(key: string, newColor: string) {
      const node = window.myDiagram.findNodeForKey(key)
      if (node) {
        window.myDiagram.model.startTransaction('change node color')
        window.myDiagram.model.setDataProperty(node.data, 'fill', newColor)
        window.myDiagram.model.commitTransaction('change node color')
      }
    }

    const green = '#53D28C'
    const formDataDetails = response?.result?.data?.form_data_detail ?? []

    window.myDiagram.links.each(function (link: any) {
      console.log('link', link.data)

      if (link.fromNode.data.key === -1) {
        // start
        window.myDiagram.model.setDataProperty(link.data, 'color', green)
      }

      for (const element of formDataDetails) {
        if (link.fromNode.data.key === element.link_from && link.toNode.data.key === element.link_to) {
          changeNodeColorByKey(link.fromNode.data.key, green)
          window.myDiagram.model.setDataProperty(link.data, 'color', green)
        }
      }
    })
    console.log('flow', response.result)
  }

  useEffect(() => {
    if (!goLoaded || !window.go || !diagramRef.current) return
    if (window.go.Diagram.fromDiv(diagramRef.current)) return
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
    fetchData()
  }, [goLoaded, formDataId])

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

  useEffect(() => {
    if (!window.go) {
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
  }, [formDataId])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent className='min-h-[calc(100vh-160px)] flex flex-col gap-4'>
            <div className='flex gap-2 items-center'>
              <Button
                variant='contained'
                startIcon={<ArrowBackIcon />}
                onClick={() => {
                  onBack()
                }}
              >
                ย้อนกลับ
              </Button>
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
