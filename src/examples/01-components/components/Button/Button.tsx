import "./Button.css"

interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
}

export default function Button({ onClick, children }: ButtonProps){
  return (
    <button type="button" className="custom-button" onClick={onClick}>
      {children}
    </button>
  )
}
