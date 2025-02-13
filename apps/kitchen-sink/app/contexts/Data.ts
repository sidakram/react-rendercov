import React from 'react';

const DataContext = React.createContext<{
    name: string;
    age: number | null;
    email: string;
    setter: React.Dispatch<
        React.SetStateAction<{
            name: string;
            age: number;
            email: string;
        }>
    >;
}>({
    name: '',
    age: null,
    email: '',
    setter: () => {},
});

export default DataContext;
