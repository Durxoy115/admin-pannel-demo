import React from 'react';
import ClientProfile from '../ClientProfile/ClientProfile';
import ClientService from '../ClientService/ClientService';
import { useParams } from 'react-router-dom';

const CombineComponent = () => {
    const id = useParams()

    console.log("This is mnain id", id.id)
    return (
        <div>
            <ClientProfile id = {id?.id}></ClientProfile>
            <ClientService clientId = {id?.id}></ClientService>
        </div>
    );
};

export default CombineComponent;