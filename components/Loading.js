import { Circle } from "better-react-spinkit";


function Loading() {
    return (
        <center style={{display: "grid", placeItems: "center", height: "100vh"}}>
            <div>
                <img 
                    src="https://logodix.com/logo/2048537.jpg" 
                    alt=""
                    style={{ margingBottom: 10 }}
                    height={200}
                />
                <Circle color="#f9a82e" size={60}/>
            </div>
        </center>
    )
}

export default Loading
