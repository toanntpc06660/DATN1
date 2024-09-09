
import { memo } from 'react';
import { useLocation } from 'react-router-dom';

const PaymentResultPage = () => {
    const location = useLocation();
    console.log(location.search);

    const queryParams = new URLSearchParams(location.search);

    const vnpStatus = queryParams.get('vnp_TransactionStatus');
    const vnpMessage = queryParams.get('vnp_Message');

    return (
        <div>
            <h1>Payment Result</h1>
            <p>Status: {vnpStatus}</p>
            <p>Message: {vnpMessage}</p>
        </div>
    );
};

export default memo(PaymentResultPage);
