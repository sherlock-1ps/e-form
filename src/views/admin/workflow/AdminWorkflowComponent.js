/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import Typography from '@mui/material/Typography'
import { useParams, useRouter } from 'next/navigation'
import { useFlowStore } from '@/store/useFlowStore'
import ActivityFlowBar from '@components/workflow/propertyBar/ActivityFlowBar'
import ApiFlowBar from '@components/workflow/propertyBar/ApiFlowBar'
import ConditionFlowBar from '@components/workflow/propertyBar/ConditionFlowBar'
import PathFlowBar from '@components/workflow/propertyBar/PathFlowBar'
import StartFlowBar from '@components/workflow/propertyBar/StartFlowBar'
import NavBarFlow from '@components/workflow/navBar/NavBarFlow'
import { toast } from 'react-toastify'
import CustomAvatar from '@/@core/components/mui/Avatar'
import { getInitials } from '@/utils/getInitials'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { useDictionary } from '@/contexts/DictionaryContext'

import {
  useCreateFlowQueryOption,
  useUpdateFlowQueryOption,
  useUpdateVersionFlowQueryOption
} from '@/queryOptions/form/formQueryOptions'

import { useDialog } from '@/hooks/useDialog'

export default function AdminWorkflowComponent() {
  const { dictionary } = useDictionary()
  const { showDialog } = useDialog()
  const flow = useFlowStore(state => state.flow)
  const selectedField = useFlowStore(state => state.selectedField)
  const setSelectedField = useFlowStore(state => state.setSelectedField)
  const setMyDiagram = useFlowStore(state => state.setMyDiagram)
  const setNodeDataArray = useFlowStore(state => state.setNodeDataArray)
  const setLinkDataArray = useFlowStore(state => state.setLinkDataArray)
  const clearSelectedField = useFlowStore(state => state.clearSelectedField)
  const updateFlowNodeText = useFlowStore(state => state.updateFlowNodeText)
  const { mutateAsync: callCreateFlow } = useCreateFlowQueryOption()
  const { mutateAsync: callUpdateFlow } = useUpdateFlowQueryOption()
  const { mutateAsync: callUpdateVersionFlow } = useUpdateVersionFlowQueryOption()

  const router = useRouter()
  const { lang: locale } = useParams()
  const diagramRef = useRef(null)
  const paletteRef = useRef(null)
  const overviewRef = useRef(null)

  const [goReady, setGoReady] = useState(false)

  // const load = () => {
  //   if (!window.go || !diagramRef.current) return
  //   const diagram = window.go.Diagram.fromDiv(diagramRef.current)
  //   diagram.model = window.go.Model.fromJson(JSON.stringify(flow.flow))
  //   diagram.model.linkFromPortIdProperty = 'fromPort'
  //   diagram.model.linkToPortIdProperty = 'toPort'
  // }

  const load = () => {
    // if (!window.go || !diagramRef.current || !window.go.Diagram.fromDiv(diagramRef.current)) return

    const diagram = window.go.Diagram.fromDiv(diagramRef.current)
    // if (!diagram || !flow?.flow) return

    try {
      diagram.model = window.go.Model.fromJson(JSON.stringify(flow.flow))
      diagram.model.linkFromPortIdProperty = 'fromPort'
      diagram.model.linkToPortIdProperty = 'toPort'
    } catch (error) {
      console.error('Failed to load diagram model:', error)
    }
  }

  const createFlow = async () => {
    if (!window.go || !diagramRef.current) return

    const diagram = window.go.Diagram.fromDiv(diagramRef.current)

    const nodeDataArray = diagram.model.nodeDataArray.map(n => ({ ...n }))

    const linkDataArray = diagram.model.linkDataArray.map(l => {
      const cloned = { ...l }
      if (l.points && typeof l.points.toArray === 'function') {
        cloned.points = l.points.toArray().flatMap(pt => [pt.x, pt.y])
      }
      return cloned
    })

    const request = {
      name: flow?.name,
      versions: [
        {
          version: flow?.version,
          nodeDataArray,
          linkDataArray
        }
      ]
    }

    try {
      const response = await callCreateFlow(request)
      if (response?.code === 'SUCCESS') {
        toast.success('บันทึกโฟลว์สำเร็จ!', { autoClose: 3000 })
        router.push(`/${locale}/workflow/dashboard`)
      }
    } catch (error) {
      console.error('save error', error)
      toast.error('บันทึกโฟลว์ล้มเหลว!' + error?.result?.error, { autoClose: 3000 })
    }
  }

  const updateVersionFlow = async () => {
    if (!window.go || !diagramRef.current) return

    const diagram = window.go.Diagram.fromDiv(diagramRef.current)

    const nodeDataArray = diagram.model.nodeDataArray.map(n => ({ ...n }))

    const linkDataArray = diagram.model.linkDataArray.map(l => {
      const cloned = { ...l }
      if (l.points && typeof l.points.toArray === 'function') {
        cloned.points = l.points.toArray().flatMap(pt => [pt.x, pt.y])
      }
      return cloned
    })

    const request = {
      id: flow?.flowId,
      name: flow?.name,
      versions: [
        {
          version: flow?.newVersion,
          public_date: flow?.publicDate,
          end_date: flow?.endDate,
          nodeDataArray,
          linkDataArray
        }
      ]
    }

    try {
      const response = await callUpdateVersionFlow(request)
      if (response?.code === 'SUCCESS') {
        toast.success('บันทึกเวอร์ชั่นใหม่โฟลว์สำเร็จ!', { autoClose: 3000 })
        router.push(`/${locale}/workflow/dashboard`)
      }
    } catch (error) {
      console.error('save error', error)
      toast.error('บันทึกเวอร์ชั่นใหม่โฟลว์ล้มเหลว!' + error?.result?.error, { autoClose: 3000 })
    }
  }

  const updateFlow = async () => {
    if (!window.go || !diagramRef.current) return

    const diagram = window.go.Diagram.fromDiv(diagramRef.current)

    const nodeDataArray = diagram.model.nodeDataArray.map(n => ({ ...n }))

    const linkDataArray = diagram.model.linkDataArray.map(l => {
      const cloned = { ...l }
      if (l.points && typeof l.points.toArray === 'function') {
        cloned.points = l.points.toArray().flatMap(pt => [pt.x, pt.y])
      }
      return cloned
    })

    const request = {
      id: flow?.flowId,
      name: flow?.name,
      versions: [
        {
          id: flow?.versionId,
          nodeDataArray,
          linkDataArray
        }
      ]
    }

    try {
      const response = await callUpdateFlow(request)
      if (response?.code === 'SUCCESS') {
        toast.success('บันทึกโฟลว์สำเร็จ!', { autoClose: 3000 })
        router.push(`/${locale}/workflow/dashboard`)
      }
    } catch (error) {
      console.error('save error', error)

      toast.error('บันทึกโฟลว์ล้มเหลว! ' + error?.result?.error, { autoClose: 3000 })
    }
  }

  const handleSaveLinkLocal = () => {
    if (!window.go || !diagramRef.current) return

    const diagram = window.go.Diagram.fromDiv(diagramRef.current)

    const nodeDataArray = diagram.model.nodeDataArray.map(n => ({ ...n }))

    const linkDataArray = diagram.model.linkDataArray.map(l => {
      const cloned = { ...l }
      if (l.points && typeof l.points.toArray === 'function') {
        cloned.points = l.points.toArray().flatMap(pt => [pt.x, pt.y])
      }
      return cloned
    })

    setLinkDataArray(linkDataArray)
  }

  const handleSaveNodeLocal = () => {
    if (!window.go || !diagramRef.current) return

    const diagram = window.go.Diagram.fromDiv(diagramRef.current)
    const nodeDataArray = diagram.model.nodeDataArray.map(n => ({ ...n }))

    setNodeDataArray(nodeDataArray)
  }

  useEffect(() => {
    if (!window.go || !diagramRef.current || window.go.Diagram.fromDiv(diagramRef.current)) return
    const go = window.go
    const $ = go.GraphObject.make

    const myDiagram = $(go.Diagram, diagramRef.current, {
      ChangedSelection: onSelectionChanged,
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

    setMyDiagram(myDiagram)

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

    const nodeTemplatePanel = (option, isEdit = false) => {
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
                            editable: false,
                            minSize: new go.Size(10, 14),
                            textEdited: (textBlock, previousText, currentText) => {
                              var node = myDiagram.selection.first()
                              if (!(node instanceof go.Node)) return
                              var data = node.data

                              updateFlowNodeText(data?.key, currentText)
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

    var linkSelectionAdornmentTemplate = new go.Adornment('Link').add(
      new go.Shape({
        isPanelMain: true, // isPanelMain declares that this Shape shares the Link.geometry
        fill: null,
        stroke: 'deepskyblue',
        strokeWidth: 0 // use selection object's strokeWidth
      })
    )

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

    function removeNodeWithoutRemovingLinks(node) {
      // console.log(node)

      if (node) {
        // Get all links connected to the node
        const links = node.linksConnected

        let retryCount = 0

        if (links.count > 0) {
          const changeNodes = () => {
            try {
              links.map(link => {
                link.toNode = null
              })
            } catch (error) {
              retryCount++
              if (retryCount <= links.count) console.log(retryCount, links.count)
              changeNodes()
            }
          }

          changeNodes()
        }

        myDiagram.remove(node)
      }
    }

    //เช็ค user delete node or link
    myDiagram.addModelChangedListener(e => {
      if (e.change === go.ChangedEvent.Remove) {
        if (e.modelChange === 'nodeDataArray') {
          const deletedNode = e.oldValue
          // console.log('🗑️ Node deleted naja:', deletedNode)

          const updatedNodes = myDiagram.model.nodeDataArray
          setNodeDataArray(updatedNodes)

          clearSelectedField()
        }

        if (e.modelChange === 'linkDataArray') {
          const deletedLink = e.oldValue

          const updatedLinks = myDiagram.model.linkDataArray
          setLinkDataArray(updatedLinks)

          if (deletedLink) {
            if (selectedField?.from == deletedLink?.from && selectedField?.to == deletedLink?.to) {
              clearSelectedField()
            }
          }
        }
      }

      if (e.change === go.ChangedEvent.Insert) {
        if (e.modelChange === 'nodeDataArray') {
          // console.log('Node added:', e.newValue)
          handleSaveNodeLocal()
        }

        if (e.modelChange === 'linkDataArray') {
          // console.log('Link added:', e.newValue)
          handleSaveLinkLocal()
        }
      }

      if (e.change === go.ChangedEvent.Property) {
        if (e.propertyName === 'location') {
          // console.log('📍 Node moved to:', e.newValue)
          handleSaveNodeLocal()
        }
        if (e.propertyName === 'points') {
          // console.log('🔗 Link shape changed:', e.object)
          handleSaveLinkLocal()
        }
        if (e.propertyName === 'form') {
          console.log('form updated:', e.newValue)
          handleSaveNodeLocal()
        }
      }

      if (e.change === go.ChangedEvent.Insert && e.modelChange === 'nodeDataArray') {
        const newNode = e.newValue

        if (newNode.category === 'start') {
          const hasStart = myDiagram.model.nodeDataArray.some(n => n.category === 'start' && n.key !== newNode.key)

          if (hasStart) {
            setTimeout(() => {
              myDiagram.model.removeNodeData(newNode)
              toast.error('ไม่สามารถเพิ่มได้, start มีได้แค่อันเดียว', { autoClose: 3000 })
            }, 0)
          }
        }
      }
    })

    const myPalette = $(go.Palette, paletteRef.current, {
      maxSelectionCount: 1,
      nodeTemplateMap: myDiagram.nodeTemplateMap, // share the templates used by myDiagram
      // simplify the link template, just in this Palette
      linkTemplate: new go.Link({
        // because the GridLayout.alignment is Location and the nodes have locationSpot == Spot.Center,
        // to line up the Link in the same manner we have to pretend the Link has the same location spot
        locationSpot: go.Spot.Center,
        selectionAdornmentTemplate: new go.Adornment('Link', {
          locationSpot: go.Spot.Center
        }).add(
          new go.Shape({
            isPanelMain: true,
            fill: null,
            stroke: 'deepskyblue',
            strokeWidth: 0
          }),
          new go.Shape({
            // the arrowhead
            toArrow: 'Standard',
            stroke: null
          })
        ),
        routing: go.Routing.AvoidsNodes,
        curve: go.Curve.JumpOver,
        corner: 5,
        toShortLength: 4
      })
        .bind('points')
        .add(
          new go.Shape({
            // the link path shape
            isPanelMain: true,
            strokeWidth: 2
          }),
          new go.Shape({
            // the arrowhead
            toArrow: 'Standard',
            stroke: null
          })
        ),
      model: new go.GraphLinksModel([
        // specify the contents of the Palette "start" "condition" "end" "comment" "activity"
        {
          text: 'Start',
          figure: 'Ellipse',
          size: '75 75',
          fill: '#53D28C',
          category: 'start'
        },
        {
          text: 'Activity',
          figure: 'Rectangle',
          category: 'activity',
          // components: JSON.stringify(['1', '2']),
          form: null,
          assignees_requestor: false,
          assignees_user: [],
          assignees_department: [],
          assignees_position: []

          // components: JSON.stringify([{ pic: "1" }, { pic: "2" }])
        },
        // { // ปิดไว้ก่อน
        //   text: 'API',
        //   figure: 'Rectangle',
        //   category: 'api',
        //   api: null
        // },
        {
          text: 'Condition',
          figure: 'Diamond',
          fill: 'lightskyblue',
          category: 'condition'
        },
        {
          text: 'Comment',
          figure: 'RoundedRectangle',
          fill: 'lightyellow',
          category: 'comment'
        },
        {
          text: 'End',
          figure: 'Ellipse',
          size: '75 75',
          fill: '#CE0620',
          category: 'end'
        }
      ])
    })

    const myOverview = $(go.Overview, overviewRef.current, {
      observed: myDiagram,
      contentAlignment: go.Spot.Center
    })

    const deleteSelectedNode = () => {
      if (!window.go || !diagramRef.current) return

      const diagram = window.go.Diagram.fromDiv(diagramRef.current)
      const selectedNode = diagram.selection.first()

      if (selectedNode instanceof window.go.Node) {
        diagram.model.removeNodeData(selectedNode.data)
      }
    }

    function onSelectionChanged() {
      var node = myDiagram.selection.first()
      if (node instanceof go.Link) {
        // console.log('ChangedSelection-link', node?.data)

        setLinkDataArray(myDiagram.model.linkDataArray)

        setSelectedField(node?.data)
      }
      if (!(node instanceof go.Node)) return
      var data = node.data
      setSelectedField(node)

      let selectedOutCome = []
      node.linksConnected.map(a => {
        if (a.data.from == node.key) {
          selectedOutCome.push(a.data)
        }
      })

      // console.log('linkDataArray', myDiagram.model.linkDataArray)
      // console.log('Current node list:', myDiagram.model.nodeDataArray)
    }

    // setMyDiagram(myDiagram)
    // setNodeDataArray(myDiagram.model.nodeDataArray)

    return () => {
      myOverview.div = null
      myDiagram.div = null
      myPalette.div = null
    }
  }, [goReady])

  useEffect(() => {
    if (flow?.flow?.linkDataArray?.length > 0 || flow?.flow?.nodeDataArray?.length > 0) {
      setTimeout(() => {
        load()
      }, 680)
    }
  }, [])

  const renderPropertybar = () => {
    if (selectedField?.points) {
      return <PathFlowBar />
    }

    switch (selectedField?.category) {
      case 'activity':
        return <ActivityFlowBar />
      case 'api':
        return <ApiFlowBar />
      case 'condition':
        return <ConditionFlowBar />
      case 'start':
        return <StartFlowBar />

      default:
        return
    }
  }

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
    <div className='bg-white h-screen w-full'>
      <div className='flex w-full h-full'>
        {/* Sidebar */}
        <div className='w-[280px] min-w-[280px] bg-[#F1F0F2] flex flex-col transition-all duration-300 border-r'>
          {/* <div className='flex items-center justify-between py-4 px-6 bg-gradient-to-r from-[#47B0FF] via-[#2D78DB] to-[#1E69CB]'>
            <div
              onClick={() => {
                router.push(`/${locale}/workflow/dashboard`)
              }}
              className=' cursor-pointer'
            >
              <img src='https://dtn.igenco.dev/media/logos/dtn/DTN_logo_blue.gif' alt='logo' className='h-[48px]' />
            </div>
            <Typography className='text-white' variant='h5'>
              E-flow
            </Typography>
          </div> */}
          {/* <section
            className='w-full h-[54px] px-3 flex items-center justify-between bg-white'
            style={{ borderBottom: '1px solid #11151A1F' }}
          >
            <Link href='/'>
              <IconButton edge='end' onMouseDown={e => e.preventDefault()} className='flex items-center justify-center'>

                <HomeOutlined sx={{ width: '24px', height: '24px' }} />
              </IconButton>
            </Link>
            <div className='flex '>

              <NotificationsDropdown iconColor={true} />
              <IconButton
                edge='end'
                onMouseDown={e => e.preventDefault()}
                className='flex items-center justify-center'
                onClick={() => {
                  showDialog({
                    id: 'alertProfileDialog',
                    component: <ProfileDialog id='alertProfileDialog' />,
                    size: 'sm'
                  })
                }}
              >
                <AccountCircleIcon fontSize='medium' />

              </IconButton>
            </div>
          </section> */}

          <div className='w-full flex-1 overflow-y-auto py-6 flex flex-col gap-4 bg-white px-4'>
            <Typography variant='h5' className='text-center'>
              {dictionary?.manageFlow}
            </Typography>
            <p className='text-gray-700 px-4'>{dictionary?.tools}</p>

            <div ref={overviewRef} className='border border-black h-[100px]' />

            <div ref={paletteRef} className=' h-[500px] w-full' />
          </div>
        </div>

        {/* Diagram Canvas */}
        <div className='relative border h-full flex-1 flex flex-col '>
          <div className=' p-4 flex items-center justify-between h-[72px] rounded-lg shadow-lg bg-white  z-10'>
            <NavBarFlow onCreate={createFlow} onUpdate={updateFlow} onUpdateVersion={updateVersionFlow} />
          </div>
          {/* <div className='absolute top-0 left-0 right-0 p-4 flex items-center justify-between h-[72px] rounded-lg shadow-lg bg-white my-4 mx-6 z-10'>
            <NavBarFlow onSave={save} />
          </div> */}
          <div ref={diagramRef} className='h-full flex-1 border' />
          {/* <button
            onClick={() => {
              save()
            }}
          >
            save
          </button> */}
        </div>
        {renderPropertybar()}
      </div>
    </div>
  )
}
