/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useFlowStore } from '@/store/useFlowStore'

import { toast } from 'react-toastify'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import IconButton from '@mui/material/IconButton'
import { Typography } from '@mui/material'

export default function ViewWorkflowComponent({ onBack }) {
  const flow = useFlowStore(state => state.flow)

  const router = useRouter()
  const { lang: locale } = useParams()
  const diagramRef = useRef(null)

  const [goReady, setGoReady] = useState(false)

  const load = () => {
    if (!window.go || !diagramRef.current) return
    const diagram = window.go.Diagram.fromDiv(diagramRef.current)
    diagram.model = window.go.Model.fromJson(JSON.stringify(flow.flow))
    diagram.model.linkFromPortIdProperty = 'fromPort'
    diagram.model.linkToPortIdProperty = 'toPort'
  }

  useEffect(() => {
    if (!diagramRef.current || !window.go) return

    const go = window.go
    const $ = go.GraphObject.make

    const myDiagram = $(go.Diagram, diagramRef.current, {
      grid: $(
        go.Panel,
        'Grid',
        $(go.Shape, 'LineH', { stroke: 'lightgray', strokeWidth: 0.5 }),
        $(go.Shape, 'LineH', { stroke: 'gray', strokeWidth: 0.5, interval: 10 }),
        $(go.Shape, 'LineV', { stroke: 'lightgray', strokeWidth: 0.5 }),
        $(go.Shape, 'LineV', { stroke: 'gray', strokeWidth: 0.5, interval: 10 })
      ),
      'draggingTool.isGridSnapEnabled': true,
      'linkingTool.isUnconnectedLinkValid': true,
      'linkingTool.portGravity': 20,
      'relinkingTool.isUnconnectedLinkValid': true,
      'relinkingTool.portGravity': 20,
      'relinkingTool.fromHandleArchetype': $(go.Shape, 'Diamond', {
        segmentIndex: 0,
        cursor: 'pointer',
        desiredSize: new go.Size(8, 8),
        fill: 'tomato',
        stroke: 'darkred'
      }),
      'relinkingTool.toHandleArchetype': $(go.Shape, 'Diamond', {
        segmentIndex: -1,
        cursor: 'pointer',
        desiredSize: new go.Size(8, 8),
        fill: 'darkred',
        stroke: 'tomato'
      }),
      'linkReshapingTool.handleArchetype': $(go.Shape, 'Diamond', {
        desiredSize: new go.Size(7, 7),
        fill: 'lightblue',
        stroke: 'deepskyblue'
      }),
      'rotatingTool.handleAngle': 270,
      'rotatingTool.handleDistance': 30,
      'rotatingTool.snapAngleMultiple': 15,
      'rotatingTool.snapAngleEpsilon': 15,
      'undoManager.isEnabled': true
    })
    myDiagram.model = $(go.GraphLinksModel, {
      nodeDataArray: [],
      linkDataArray: []
    })
    myDiagram.model.linkFromPortIdProperty = 'fromPort'
    myDiagram.model.linkToPortIdProperty = 'toPort'
    myDiagram.grid.gridCellSize = new go.Size(15, 15)
    myDiagram.isReadOnly = true

    function makePort(name, spot, option) {
      return new go.Shape('Circle', {
        fill: null, // not seen, by default; set to a translucent gray by showSmallPorts, defined below
        stroke: null,
        desiredSize: new go.Size(15, 15),
        alignment: spot, // align the port on the main Shape
        alignmentFocus: spot, // just inside the Shape
        portId: name, // declare this object to be a "port"
        fromSpot: spot,
        toSpot: spot, // declare where links may connect at this port
        // fromLinkable: output,
        // toLinkable: input, // declare whether the user may draw links to/from here
        cursor: 'pointer', // show a different cursor to indicate potential link point

        fromLinkable: true,
        toLinkable: true,
        fromLinkableDuplicates: true,
        toLinkableDuplicates: true,
        fromLinkableSelfNode: true,
        toLinkableSelfNode: true,

        ...option
      })
    }

    var nodeSelectionAdornmentTemplate = new go.Adornment('Auto').add(
      new go.Shape({
        fill: null,
        stroke: 'deepskyblue',
        strokeWidth: 1.5,
        strokeDashArray: [4, 2]
      }),
      new go.Placeholder()
    )

    var nodeResizeAdornmentTemplate = new go.Adornment('Spot', {
      locationSpot: go.Spot.Right
    }).add(
      new go.Placeholder(),
      new go.Shape({
        alignment: go.Spot.TopLeft,
        cursor: 'nw-resize',
        desiredSize: new go.Size(6, 6),
        fill: 'lightblue',
        stroke: 'deepskyblue'
      }),
      new go.Shape({
        alignment: go.Spot.Top,
        cursor: 'n-resize',
        desiredSize: new go.Size(6, 6),
        fill: 'lightblue',
        stroke: 'deepskyblue'
      }),
      new go.Shape({
        alignment: go.Spot.TopRight,
        cursor: 'ne-resize',
        desiredSize: new go.Size(6, 6),
        fill: 'lightblue',
        stroke: 'deepskyblue'
      }),
      new go.Shape({
        alignment: go.Spot.Left,
        cursor: 'w-resize',
        desiredSize: new go.Size(6, 6),
        fill: 'lightblue',
        stroke: 'deepskyblue'
      }),
      new go.Shape({
        alignment: go.Spot.Right,
        cursor: 'e-resize',
        desiredSize: new go.Size(6, 6),
        fill: 'lightblue',
        stroke: 'deepskyblue'
      }),
      new go.Shape({
        alignment: go.Spot.BottomLeft,
        cursor: 'se-resize',
        desiredSize: new go.Size(6, 6),
        fill: 'lightblue',
        stroke: 'deepskyblue'
      }),
      new go.Shape({
        alignment: go.Spot.Bottom,
        cursor: 's-resize',
        desiredSize: new go.Size(6, 6),
        fill: 'lightblue',
        stroke: 'deepskyblue'
      }),
      new go.Shape({
        alignment: go.Spot.BottomRight,
        cursor: 'sw-resize',
        desiredSize: new go.Size(6, 6),
        fill: 'lightblue',
        stroke: 'deepskyblue'
      })
    )

    var nodeRotateAdornmentTemplate = new go.Adornment({
      locationSpot: go.Spot.Center,
      locationObjectName: 'ELLIPSE'
    }).add(
      new go.Shape('Ellipse', {
        name: 'ELLIPSE',
        cursor: 'pointer',
        desiredSize: new go.Size(7, 7),
        fill: 'lightblue',
        stroke: 'deepskyblue'
      }),
      new go.Shape({
        geometryString: 'M3.5 7 L3.5 30',
        isGeometryPositioned: true,
        stroke: 'deepskyblue',
        strokeWidth: 1.5,
        strokeDashArray: [4, 2]
      })
    )

    function findImgPath(pic) {
      // console.log("pic",pic)
      return `/images/${pic}.svg`
    }

    function jsonParse(data) {
      // console.log("data",data)
      return JSON.parse(data)
    }

    const nodeTemplatePanel = (option, isEdit = true) => {
      return new go.Node('Spot', {
        locationSpot: go.Spot.Center,
        selectable: true,
        // resizable: true,
        // rotatable: true,
        selectionAdornmentTemplate: nodeSelectionAdornmentTemplate,
        resizeObjectName: 'PANEL',
        resizeAdornmentTemplate: nodeResizeAdornmentTemplate,
        rotateAdornmentTemplate: nodeRotateAdornmentTemplate,
        mouseEnter: (e, node) => showSmallPorts(node, true),
        mouseLeave: (e, node) => showSmallPorts(node, false)
      })
        .bindTwoWay('location', 'location', go.Point.parse, go.Point.stringify)
        .bindTwoWay('angle')
        .add(
          new go.Panel('Auto', { name: 'PANEL' })
            .bindTwoWay('desiredSize', 'size', go.Size.parse, go.Size.stringify)
            .add(
              new go.Shape('Rectangle', {
                portId: '', // the default port: if no spot on link data, use closest side
                cursor: 'pointer',
                fill: 'white',
                strokeWidth: 2

                // fromLinkable: true,
                // toLinkable: true,

                // fromLinkableDuplicates: true,
                // toLinkableDuplicates: true,
                // fromLinkableSelfNode: true,
                // toLinkableSelfNode: true,

                // ...option
              })
                .bind('figure')
                .bind('fill'),
              new go.TextBlock({
                font: 'bold 10pt Helvetica, Arial, sans-serif',
                margin: 8,
                maxSize: new go.Size(160, NaN),
                wrap: go.Wrap.Fit,
                editable: isEdit
              }).bindTwoWay('text')
            ),
          makePort('T', go.Spot.Top, option),
          makePort('L', go.Spot.Left, option),
          makePort('R', go.Spot.Right, option),
          makePort('B', go.Spot.Bottom, option)
        )
    }

    const nodeTemplatePanelStart = (option, isEdit = true) => {
      return new go.Node('Spot', {
        locationSpot: go.Spot.Center,
        selectable: true,
        // resizable: true,
        // rotatable: true,
        selectionAdornmentTemplate: nodeSelectionAdornmentTemplate,
        resizeObjectName: 'PANEL',
        resizeAdornmentTemplate: nodeResizeAdornmentTemplate,
        rotateAdornmentTemplate: nodeRotateAdornmentTemplate,
        mouseEnter: (e, node) => showSmallPorts(node, true),
        mouseLeave: (e, node) => showSmallPorts(node, false)
      })
        .bindTwoWay('location', 'location', go.Point.parse, go.Point.stringify)
        .bindTwoWay('angle')
        .add(
          new go.Panel('Auto', { name: 'PANEL' })
            .bindTwoWay('desiredSize', 'size', go.Size.parse, go.Size.stringify)
            .add(
              new go.Shape('Rectangle', {
                portId: '', // the default port: if no spot on link data, use closest side
                cursor: 'pointer',
                fill: 'white',
                strokeWidth: 2

                // fromLinkable: true,
                // toLinkable: true,

                // fromLinkableDuplicates: true,
                // toLinkableDuplicates: true,
                // fromLinkableSelfNode: true,
                // toLinkableSelfNode: true,

                // ...option
              })
                .bind('figure')
                .bind('fill'),
              new go.TextBlock({
                font: 'bold 10pt Helvetica, Arial, sans-serif',
                margin: 8,
                maxSize: new go.Size(160, NaN),
                wrap: go.Wrap.Fit,
                editable: isEdit
              }).bindTwoWay('text')
            ),

          makePort('B', go.Spot.Bottom, option)
        )
    }

    const imgDisplay = new go.Panel(go.Panel.Table, {
      background: 'transparent',
      cursor: 'Pointer',
      column: 0,
      height: 18,
      alignment: go.Spot.TopLeft
    }).add(
      new go.Panel(go.Panel.Horizontal).add(
        new go.Picture({
          alignment: go.Spot.TopLeft,
          name: 'PICTURE',
          source: '/images/3.png',
          desiredSize: new go.Size(18, 18)
        }).bind('source', findImgPath)
      )
    )

    const nodeTemplatePanelActivity = (option, isEdit = true) => {
      return new go.Node('Spot', {
        locationSpot: go.Spot.Center,
        alignment: go.Spot.TopLeft,
        selectable: true,
        // resizable: true,
        // rotatable: true,
        selectionAdornmentTemplate: nodeSelectionAdornmentTemplate,
        resizeObjectName: 'PANEL',
        resizeAdornmentTemplate: nodeResizeAdornmentTemplate,
        rotateAdornmentTemplate: nodeRotateAdornmentTemplate,
        mouseEnter: (e, node) => showSmallPorts(node, true),
        mouseLeave: (e, node) => showSmallPorts(node, false)
      })
        .bindTwoWay('location', 'location', go.Point.parse, go.Point.stringify)
        .bindTwoWay('angle')
        .add(
          new go.Panel('Auto', { name: 'PANEL' })
            .bindTwoWay('desiredSize', 'size', go.Size.parse, go.Size.stringify)
            .add(
              new go.Shape('Rectangle', {
                alignment: go.Spot.TopLeft,
                portId: '', // the default port: if no spot on link data, use closest side
                cursor: 'pointer',
                fill: 'white',

                // fromLinkable: true,
                // toLinkable: true,
                // toLinkableDuplicates: true,

                // fromLinkableDuplicates: true,
                // fromLinkableSelfNode: true,
                // toLinkableSelfNode: true,

                strokeWidth: 2
              })
                // .theme('fill', 'background')
                .bind('figure')
                .bind('fill'),
              new go.Panel(go.Panel.Table, {
                margin: 0.5,
                defaultRowSeparatorStrokeWidth: 0.5
              })
                // .theme('defaultRowSeparatorStroke', 'divider')
                .add(
                  new go.Panel(go.Panel.Table, {
                    padding: new go.Margin(15, 18, 15, 18),
                    minSize: new go.Size(100, NaN)
                  })

                    //  .addColumnDefinition(0, { width: 120 })
                    .add(
                      new go.Panel(go.Panel.Table, {
                        column: 0,

                        stretch: go.Stretch.Vertical,
                        defaultAlignment: go.Spot.Left
                      }).add(
                        new go.Panel(go.Panel.Horizontal, { row: 0 }).add(
                          new go.TextBlock({
                            editable: true,
                            minSize: new go.Size(10, 14),
                            textEdited: (textBlock, previousText, currentText) => {
                              var node = myDiagram.selection.first()
                              if (!(node instanceof go.Node)) return
                              var data = node.data

                              // console.log('Text edited:', {
                              //   previousText,
                              //   currentText
                              // })
                            }
                          }).bindTwoWay('text')
                          // .theme('stroke', 'text')
                          // .theme('font', 'name'),
                        )
                      )
                    ),
                  new go.Panel(go.Panel.Table, {
                    row: 1,
                    padding: 1,
                    alignment: go.Spot.TopLeft,

                    // stretch: go.Stretch.Fill,
                    // defaultStretch: go.Stretch.Fill,
                    // stretch: go.Stretch.Horizontal,
                    defaultColumnSeparatorStrokeWidth: 0.5
                  }).add(
                    new go.Panel('Horizontal', {
                      row: 5,
                      itemTemplate: imgDisplay
                    }).bind('itemArray', 'components', jsonParse)
                  )
                )
            ),
          makePort('T', go.Spot.Top, option),
          makePort('L', go.Spot.Left, option),
          makePort('R', go.Spot.Right, option),
          makePort('B', go.Spot.Bottom, option)
        )
    }

    const nodeTemplatePanelCommend = (option, isEdit = true) => {
      return new go.Node('Spot', {
        locationSpot: go.Spot.Center,
        selectable: true,
        // resizable: true,
        // rotatable: true,
        selectionAdornmentTemplate: nodeSelectionAdornmentTemplate,
        resizeObjectName: 'PANEL',
        resizeAdornmentTemplate: nodeResizeAdornmentTemplate,
        rotateAdornmentTemplate: nodeRotateAdornmentTemplate,
        mouseEnter: (e, node) => showSmallPorts(node, true),
        mouseLeave: (e, node) => showSmallPorts(node, false)
      })
        .bindTwoWay('location', 'location', go.Point.parse, go.Point.stringify)
        .bindTwoWay('angle')
        .add(
          new go.Panel('Auto', { name: 'PANEL' })
            .bindTwoWay('desiredSize', 'size', go.Size.parse, go.Size.stringify)
            .add(
              new go.Shape('Rectangle', {
                portId: '', // the default port: if no spot on link data, use closest side
                cursor: 'pointer',
                fill: 'white',
                strokeWidth: 2

                // fromLinkable: true,
                // toLinkable: true,

                // fromLinkableDuplicates: true,
                // toLinkableDuplicates: true,
                // fromLinkableSelfNode: true,
                // toLinkableSelfNode: true,

                // ...option
              })
                .bind('figure')
                .bind('fill'),
              new go.TextBlock({
                font: 'bold 10pt Helvetica, Arial, sans-serif',
                margin: 8,
                maxSize: new go.Size(160, NaN),
                wrap: go.Wrap.Fit,
                editable: isEdit
              }).bindTwoWay('text')
            )
        )
    }

    const templmap = new go.Map()
    templmap.add(
      'start',
      nodeTemplatePanelStart(
        {
          fromLinkableDuplicates: false,
          toLinkableDuplicates: false,
          fromLinkableSelfNode: false,
          toLinkableSelfNode: false
        },
        false
      )
    )
    templmap.add(
      'condition',
      nodeTemplatePanel({
        fromLinkableDuplicates: false,
        toLinkableDuplicates: false,
        fromLinkableSelfNode: false,
        toLinkableSelfNode: false
      })
    )
    templmap.add(
      'end',
      nodeTemplatePanel(
        {
          fromLinkableDuplicates: false,
          toLinkableDuplicates: false,
          fromLinkableSelfNode: false,
          toLinkableSelfNode: false
        },
        false
      )
    )
    templmap.add('comment', nodeTemplatePanelCommend({}))
    templmap.add('activity', nodeTemplatePanelActivity({}))
    templmap.add('api', nodeTemplatePanelActivity({}))

    myDiagram.nodeTemplateMap = templmap

    function showSmallPorts(node, show) {
      node.ports.each(port => {
        if (port.portId !== '') {
          // don't change the default port, which is the big shape
          port.fill = show ? 'rgba(0,0,0,.3)' : null
        }
      })
    }

    myDiagram.linkTemplate = new go.Link({
      // the whole link panel
      toShortLength: 4,
      relinkableTo: true,
      reshapable: true,
      routing: go.Routing.AvoidsNodes,
      curve: go.Curve.JumpOver,
      corner: 5
    })
      .bindTwoWay('points')
      .add(
        new go.Shape('Rectangle', { stroke: 'black', strokeWidth: 1.5 }),
        new go.Shape({ toArrow: 'OpenTriangle', stroke: 'black' }),
        new go.TextBlock({
          font: '400 9pt Source Sans Pro, sans-serif',
          // segmentIndex: -1
          segmentOffset: new go.Point(NaN, 10),
          isMultiline: false,
          editable: true
        }).bindTwoWay('text')
        // new go.Binding("segmentOffset", function (pos) {
        //   console.log("pos", pos)
        //   return new go.Point(0, pos); // Use dynamic Y offset from your data
        // })
      )

    return () => {
      myDiagram.div = null
    }
  }, [goReady])

  useEffect(() => {
    if (flow?.flow?.linkDataArray?.length > 0 || flow?.flow?.nodeDataArray?.length > 0) {
      setTimeout(() => {
        load()
      }, 150)
    }
  }, [])

  const loadScript = src => {
    return new Promise((resolve, reject) => {
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
          setGoReady(true)
        })
        .catch(() => {
          console.error('❌ Failed to load go.js')
          toast.error('ไม่สามารถโหลด script ได้', { autoClose: 3000 })
          setTimeout(() => {
            router.back()
          }, 500)
        })
    } else {
      setGoReady(true)
    }
  }, [])

  return (
    <div className='bg-white w-full relative rounded-md' style={{ height: 'calc(100vh - 64px)' }}>
      <div className='flex w-full h-full'>
        <div className='relative border h-full flex-1 flex flex-col '>
          <div ref={diagramRef} className='h-full flex-1 border' />
        </div>
      </div>

      {onBack && (
        <div className='absolute top-5 left-3 z-50 flex gap-4 bg-primaryLight rounded-md'>
          <IconButton
            color='primary'
            onClick={() => {
              onBack()
            }}
          >
            <ArrowBackIcon />
            <Typography variant='h6'>ย้อนกลับ</Typography>
          </IconButton>
        </div>
      )}
    </div>
  )
}
