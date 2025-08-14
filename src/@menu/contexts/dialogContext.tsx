// 'use client'
// import React, { createContext, useState, useCallback } from 'react'

// // ไม่มีการเปลี่ยนแปลงใน interface
// interface DialogProps {
//   id: string
//   component: React.ReactNode
//   props?: any
//   size?: 'sm' | 'md' | 'lg'
//   closeOnBackdropClick?: boolean
// }

// interface DialogContextProps {
//   dialogs: DialogProps[]
//   showDialog: (dialog: DialogProps) => void
//   closeDialog: (id: string) => void
// }

// export const DialogContext = createContext<DialogContextProps | undefined>(
//   undefined,
// )

// export const DialogProvider = ({
//   children,
// }: {
//   children: React.ReactNode
// }) => {
//   const [dialogs, setDialogs] = useState<DialogProps[]>([])

//   const showDialog = useCallback((dialog: DialogProps) => {
//     setDialogs((prevDialogs) => [...prevDialogs, dialog])
//   }, [])

//   const closeDialog = useCallback((id: string) => {
//     setDialogs((prevDialogs) => prevDialogs.filter((dialog) => dialog.id !== id))
//   }, [])

//   // *** START: ส่วนที่เพิ่มเข้ามา ***

//   const handleBackdropClick = (dialog: DialogProps) => {
//     // ถ้า closeOnBackdropClick ไม่ได้ถูกตั้งค่าเป็น false (เป็น true หรือ undefined) ให้ปิด dialog

//     alert()
//     if (dialog.closeOnBackdropClick !== false) {
//       closeDialog(dialog.id)
//     }
//   }

//   // *** END: ส่วนที่เพิ่มเข้ามา ***

//   return (
//     <DialogContext.Provider value={{ dialogs, showDialog, closeDialog }}>
//       {children}

//       {/* *** START: ส่วนแสดงผล Dialog ที่เพิ่มเข้ามา *** */}
//       {dialogs.map((dialog) => (
//         // พื้นหลัง (Backdrop)
//         <div
//           key={dialog.id}
//           onClick={() => handleBackdropClick(dialog)}
//           style={{
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: 'rgba(0, 0, 0, 0.5)',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             zIndex: 1000,
//           }}
//         >

//           {/* <div

//             onClick={(e) => e.stopPropagation()}
//             style={{
//               background: 'white',
//               padding: '24px',
//               borderRadius: '8px',
//               boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//             }}
//           >
//             {dialog.component}
//           </div> */}


//         </div>
//       ))}
//       {/* *** END: ส่วนแสดงผล Dialog ที่เพิ่มเข้ามา *** */}
//     </DialogContext.Provider>
//   )
// }


// 'use client'
// import React, { createContext, useState, useCallback, useContext } from 'react'

// interface DialogProps {
//   id: string
//   component: React.ReactNode
//   props?: any
//   size?: 'sm' | 'md' | 'lg'
//   closeOnBackdropClick?: boolean // เพิ่มตัวเลือก
// }

// interface DialogContextProps {
//   dialogs: DialogProps[]
//   showDialog: (dialog: DialogProps) => void
//   closeDialog: (id: string) => void
// }

// export const DialogContext = createContext<DialogContextProps | undefined>(undefined)

// export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
//   const [dialogs, setDialogs] = useState<DialogProps[]>([])

//   const showDialog = useCallback((dialog: DialogProps) => {
//     setDialogs(prevDialogs => [...prevDialogs, dialog])
//   }, [])

//   const closeDialog = useCallback((id: string) => {
//     setDialogs(prevDialogs => prevDialogs.filter(dialog => dialog.id !== id))
//   }, [])

//   return (
//     <DialogContext.Provider value={{ dialogs, showDialog, closeDialog }}>
//       {children}


//       {dialogs.map(({ id, component, size, closeOnBackdropClick }) => (
//         <div
//           key={id}
//           className="dialog-overlay"
//           onClick={() => {
//             if (closeOnBackdropClick) closeDialog(id)
//           }}
//           style={{
//             position: 'fixed',
//             inset: 0,
//             backgroundColor: 'rgba(0,0,0,0.5)',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             zIndex: 9999
//           }}
//         >
//           <div
//             className={`dialog-container dialog-${size || 'md'}`}
//             onClick={(e) => e.stopPropagation()}
//             style={{
//               background: '#fff',
//               borderRadius: '8px',
//               padding: '20px',
//               minWidth: size === 'sm' ? '300px' : size === 'lg' ? '800px' : '500px'
//             }}
//           >
//             {component}
//           </div>
//         </div>
//       ))}


//     </DialogContext.Provider>
//   )
// }





'use client'
import React, { createContext, useState, useCallback } from 'react'

interface DialogProps {
  id: string
  component: React.ReactNode
  props?: any
  size?: 'sm' | 'md' | 'lg' | 'xl'
   closeOnBackdropClick?: boolean
}

interface DialogContextProps {
  dialogs: DialogProps[]
  showDialog: (dialog: DialogProps) => void
  closeDialog: (id: string) => void
}

export const DialogContext = createContext<DialogContextProps | undefined>(
  undefined
)

export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [dialogs, setDialogs] = useState<DialogProps[]>([])

  const showDialog = useCallback((dialog: DialogProps) => {
    setDialogs(prevDialogs => [...prevDialogs, dialog])
  }, [])

  const closeDialog = useCallback((id: string) => {
    setDialogs(prevDialogs => prevDialogs.filter(dialog => dialog.id !== id))
  }, [])

  return (
    <DialogContext.Provider value={{ dialogs, showDialog, closeDialog }}>
      {children}
    </DialogContext.Provider>
  )
}

