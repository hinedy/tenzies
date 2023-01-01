export default function Die(props) {
    return (
        <div
         className="die"
         style={{backgroundColor: props.isHeld ? "#59E391" : "#fff"}}
         onClick={props.hold}
         >

            <h1>{props.value}</h1>
        </div>
    )
}