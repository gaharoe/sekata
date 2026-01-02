import Loader from "./Loader";

export default function UserLoading(){
    return (
        <div className="flex justify-center items-center fixed top-0 left-0 bottom-0 right-0 z-999999 backdrop-blur-md bg-black/10">
            <Loader />
        </div>
    )
}