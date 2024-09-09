import { memo } from "react";
import Header from "../header";
import Footer from "../footer";

const masterLayout = ({children,...props}) => {
    return (

        <>
            <Header/>
            {children}
            <Footer/>
        </>
    );
};

export default memo(masterLayout);