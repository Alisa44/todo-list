import React from 'react';
import Button from "../Button/Button.tsx";

type FilterToggleProps = {
    onClick: () => void;
};

const FilterToggle: React.FC<FilterToggleProps> = ({ onClick }) => {
    return (
        <Button onClick={onClick}>
            🔍 Filter
        </Button>
    );
};

export default FilterToggle;
