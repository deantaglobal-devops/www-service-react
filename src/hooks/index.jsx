import React from 'react';
import { AuthProvider } from '../hooks/Auth';

const AppProvider = ({ children }) => (
    <AuthProvider>
        {children}
    </AuthProvider>
);

export default AppProvider;