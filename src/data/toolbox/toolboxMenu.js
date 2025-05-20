import {
  TableRowsOutlined,
  TableChartOutlined,
  TitleOutlined,
  ArticleOutlined,
  ImageOutlined,
  OndemandVideoOutlined,
  AddBoxOutlined,
  TextFieldsOutlined,
  EditCalendarOutlined,
  UploadFileOutlined,
  Draw,
  InsertLinkOutlined,
  ArrowDropDownCircleOutlined,
  CheckBoxOutlined,
  RadioButtonCheckedOutlined,
  ToggleOnOutlined,
  GridViewOutlined
} from '@mui/icons-material'
import { v4 as uuidv4 } from 'uuid'

export const MAX_FILE_IMAGE_SIZE_MB = Number(process.env.NEXT_PUBLIC_MAX_FILE_IMAGE_SIZE_MB)

export const MAX_FILE_VIDEO_SIZE_MB = Number(process.env.NEXT_PUBLIC_MAX_VIDEO_IMAGE_SIZE_MB)

export const toolboxLayoutMenu = [
  {
    id: 1,
    icon: <TableRowsOutlined />,
    config: {
      style: {
        minWidth: '50px',
        minHeight: '32px',
        fontSize: 16,
        textAlign: 'start'
      },
      details: {
        type: 'textfield',
        label: 'กล่องข้อความ',
        tag: '',
        value: '',
        placeholder: 'พิมพ์ข้อความที่นี่',
        helperText: 'คำแนะนำ'
      }
    }
  },
  {
    id: 2,
    icon: <TableChartOutlined />,
    config: {
      style: {
        minWidth: '30px',
        minHeight: '32px',
        fontSize: 16,
        color: '#000000',
        textAlign: 'start'
      },
      details: {
        type: 'text',
        label: 'ข้อความ',
        value: '',
        placeholder: 'พิมพ์ข้อความของคุณที่นี่'
      }
    }
  }
]

export const toolboxGridMenu = [
  {
    id: 1,
    icon: <GridViewOutlined />,
    config: {
      style: {
        fontSize: 16,
        color: '#000000',
        textAlign: 'start',
        fontWeight: 'normal'
      },
      details: {
        type: 'grid',
        label: 'Grid',
        value: ''
      }
    }
  }
]

export const toolboxDocumentBaseMenu = [
  {
    id: 1,
    icon: <TitleOutlined />,
    config: {
      style: {
        fontSize: 16,
        color: '#000000',
        textAlign: 'start',
        fontWeight: 'normal'
      },
      details: {
        type: 'text',
        label: 'ข้อความ',
        placeholder: 'พิมพ์ข้อความที่นี่',
        isUse: true,
        isShow: true,
        value: {
          valueType: 'string',
          value: ''
        },
        trigger: {
          isTrigger: false
        }
      }
    }
  },
  {
    id: 2,
    icon: <ArticleOutlined />,
    config: {
      style: {},
      details: {
        type: 'editor',
        label: 'WYSIWYG Editor',
        value: ''
      }
    }
  },
  {
    id: 3,
    icon: <ImageOutlined />,
    config: {
      style: {
        width: '',
        height: '',
        defaultWidth: '100%',
        defaultHeight: 'auto',
        objectFit: 'contain'
      },
      details: {
        type: 'image',
        label: 'รูปภาพ',
        isUse: true,
        isShow: true,
        value: {
          value: ''
        },
        trigger: {
          isTrigger: false
        }
      }
    }
  },
  {
    id: 4,
    icon: <OndemandVideoOutlined />,
    config: {
      style: {
        width: '',
        height: '',
        defaultWidth: '100%',
        defaultHeight: 'auto',
        objectFit: 'contain',
        autoPlay: true,
        loop: true
      },
      details: {
        type: 'video',
        label: 'วีดีโอ',
        isUse: true,
        isShow: true,
        value: {
          value: ''
        },
        trigger: {
          isTrigger: false
        }
      }
    }
  }
]

export const toolboxCreateformMenu = [
  {
    id: 1,
    icon: <AddBoxOutlined />,
    config: {
      style: {
        textAlign: 'start',
        fontWeight: 'normal',
        width: '',
        height: '',
        defaultWidth: 'auto',
        defaultHeight: 'auto'
      },
      details: {
        type: 'button',
        label: 'ปุ่ม',
        isUse: true,
        isShow: true,
        value: {
          valueType: 'string',
          value: 'ปุ่ม'
        },
        trigger: {
          isTrigger: false
        }
      }
    }
  },
  {
    id: 2,
    icon: <TextFieldsOutlined />,
    config: {
      style: {
        fontSize: 16,
        color: '#000000',
        textAlign: 'start',
        fontWeight: 'normal'
      },
      details: {
        type: 'textfield',
        label: 'กล่องข้อความ',
        value: {
          valueType: 'string',
          value: ''
        },
        tag: {
          isShow: true,
          value: 'ป้ายกำกับ'
        },
        placeholder: {
          isShow: true,
          value: 'พิมพ์ข้อความของคุณที่นี่'
        },
        helperText: {
          isShow: false,
          value: 'คำแนะนำ'
        },
        limit: {
          isLimit: false,
          maxCharacter: ''
        },
        isUse: true,
        isShow: true,
        isRequired: true
      }
    }
  },
  {
    id: 3,
    icon: <EditCalendarOutlined />,
    config: {
      style: {},
      details: {
        type: 'date',
        label: 'วันที่',
        title: 'เลือกวันที่',
        value: {
          valueType: 'custom',
          value: ''
        },
        tag: {
          isShow: true,
          value: 'เลือกวันที่'
        },
        placeholder: {
          isShow: true,
          value: 'วัน / เดือน / ปี'
        },
        helperText: {
          isShow: false,
          value: 'คำแนะนำ'
        },
        isUse: true,
        isShow: true,
        isShowTime: true,
        isRequired: true
      }
    }
  },
  {
    id: 4,
    icon: <EditCalendarOutlined />,
    config: {
      style: {},
      details: {
        type: 'datetime',
        label: 'วันที่/เวลา',
        title: 'เลือกวันที่',
        value: {
          valueType: 'custom',
          value: ''
        },
        tag: {
          isShow: true,
          value: 'เลือกวันที่และเวลา'
        },
        placeholder: {
          isShow: true,
          value: 'วัน / เดือน / ปี / เวลา'
        },
        helperText: {
          isShow: false,
          value: 'คำแนะนำ'
        },
        isUse: true,
        isShow: true,
        isShowTime: true,
        isRequired: true
      }
    }
  },
  {
    id: 5,
    icon: <UploadFileOutlined />,
    config: {
      style: {
        width: '',
        height: '',
        defaultWidth: '100%',
        defaultHeight: 'auto'
      },
      details: {
        type: 'upload',
        label: 'ไฟล์อัปโหลด',
        value: [],
        placeholder: {
          isShow: true,
          value: 'กดปุ่มเพื่อเพิ่มไฟล์'
        },
        fileType: [
          '.jpg',
          '.mp4',
          '.pdf',
          '.jpeg',
          '.png',
          '.gif',
          '.webp',
          '.mov',
          '.avi',
          '.doc',
          '.docx',
          '.xls',
          '.xlsx',
          '.pptx',
          '.ppt',
          '.csv'
        ],
        maxSize: 20,
        maxFileUpload: 50,
        isUse: true,
        isShow: true
      }
    }
  },
  {
    id: 6,
    icon: <InsertLinkOutlined />,
    config: {
      style: {
        fontSize: 16,
        fontWeight: 'normal',
        color: '#0463EA',
        textAlign: 'start',
        textDecoration: 'underline'
      },
      details: {
        type: 'link',
        label: 'ลิงก์',
        value: '',
        placeholder: 'พิมพ์ลิงก์ที่นี่',
        isUse: true,
        isShow: true,
        isCutLink: false,
        isRequired: true
      }
    }
  },
  {
    id: 7,
    icon: <Draw />,
    config: {
      style: {
        fontSize: 16
      },
      details: {
        type: 'signature',
        label: 'E-Signature',
        signType: {
          type: 'master',
          formId: ''
        },
        signer: {
          isShow: true,
          value: ''
        },
        tag: {
          isShow: true,
          value: 'ลงชื่อ'
        },
        endTag: {
          isShow: false,
          value: ''
        },
        position: { isShow: true, value: '', placeholder: 'จะปรากฏเมื่อลงนาม' },
        date: { isShow: true, value: '', placeholder: 'จะปรากฏเมื่อลงนาม' },
        setting: {
          isUserUse: false
        },
        placeholder: 'พิมพ์ข้อความของคุณที่นี่',
        isUse: true,
        isShow: true,
        isRequired: true
      }
    }
  }
  // {
  //   id: 5,
  //   icon: <TableChartOutlined />,
  //   config: {
  //     style: {
  //       minWidth: '30px',
  //       minHeight: '32px',
  //       fontSize: 16,
  //       color: '#000000',
  //       textAlign: 'start'
  //     },
  //     details: {
  //       type: 'text',
  //       label: 'ตาราง',
  //       value: '',
  //       placeholder: 'พิมพ์ข้อความของคุณที่นี่'
  //     }
  //   }
  // }
]
export const toolboxOptionMenu = [
  {
    id: 1,
    icon: <ArrowDropDownCircleOutlined />,
    config: {
      style: {},
      details: {
        type: 'dropdown',
        label: 'ตัวเลือก',
        value: '',
        isUse: true,
        isShow: true,
        itemList: [
          { name: 'Ten', value: 10, enhanced: false },
          { name: 'Twenty', value: 20, enhanced: false },
          { name: 'Thirty', value: 30, enhanced: false }
        ],
        tag: {
          isShow: true,
          value: 'ตัวเลือก'
        },
        placeholder: {
          isShow: true,
          value: 0,
          name: 'ตัวเลือก ....'
        },
        helperText: {
          isShow: true,
          value: 'คำแนะนำ'
        }
      }
    }
  },
  {
    id: 2,
    icon: <CheckBoxOutlined />,
    config: {
      style: {},
      details: {
        type: 'checkbox',
        label: 'หลายตัวเลือก',
        minCheckbox: 1,
        maxCheckbox: 3,
        row: false,
        isUse: true,
        isShow: true,
        isRequired: true,
        itemList: [
          { isChecked: true, value: '', name: 'ตัวเลือก 1', enhanced: false },
          { isChecked: false, value: '', name: 'ตัวเลือก 2', enhanced: false },
          { isChecked: true, value: '', name: 'ตัวเลือก 3', enhanced: false }
        ],
        defaultAdd: { isChecked: false, value: '', name: 'ตัวเลือก ', enhanced: false }
      }
    }
  },
  {
    id: 3,
    icon: <RadioButtonCheckedOutlined />,
    config: {
      style: {},
      details: {
        type: 'radio',
        label: 'ตัวเลือก 1',
        row: false,
        isUse: true,
        isShow: true,
        isRequired: true,
        value: '',
        itemList: [
          { value: '1', name: 'ตัวเลือก 1', enhanced: false },
          { value: '2', name: 'ตัวเลือก 2', enhanced: false },
          { value: '3', name: 'ตัวเลือก 3', enhanced: false }
        ],
        defaultAdd: { value: '', name: 'ตัวเลือก ', enhanced: false }
      }
    }
  },
  {
    id: 4,
    icon: <ToggleOnOutlined />,
    config: {
      style: {},
      details: {
        type: 'switch',
        label: 'สวิตซ์',
        text: 'Switch',
        value: '0',
        isUse: true,
        isShow: true
      }
    }
  }
]

// const test = {
//   value:"",
//   valueConfig:{

//   }:
// }
