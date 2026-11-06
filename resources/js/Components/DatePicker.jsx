import React, { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Indonesian } from 'flatpickr/dist/l10n/id.js';

export default function DatePicker({ value, onChange, min, max, className = '', ...props }) {
    const inputRef = useRef(null);
    const fpRef = useRef(null);

    // Format Y-m-d to d/m/Y for flatpickr display
    const getDisplayValue = (val) => {
        if (!val) return '';
        const parts = val.split('-');
        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return val;
    };

    // Safely parse Y-m-d to Date object to avoid flatpickr leap year parsing bug
    const parseToDateObj = (val) => {
        if (!val) return null;
        const parts = val.split('-');
        if (parts.length === 3) {
            return new Date(parts[0], parts[1] - 1, parts[2]);
        }
        return null;
    };

    const onChangeRef = useRef(onChange);
    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        if (!inputRef.current) return;
        
        fpRef.current = flatpickr(inputRef.current, {
            locale: Indonesian,
            dateFormat: 'd/m/Y',
            defaultDate: parseToDateObj(value),
            minDate: parseToDateObj(min),
            maxDate: parseToDateObj(max),
            allowInput: true,
            onChange: (selectedDates) => {
                if (onChangeRef.current) {
                    if (selectedDates.length > 0) {
                        const date = selectedDates[0];
                        const y = date.getFullYear();
                        const m = String(date.getMonth() + 1).padStart(2, '0');
                        const d = String(date.getDate()).padStart(2, '0');
                        onChangeRef.current({ target: { value: `${y}-${m}-${d}` } });
                    } else {
                        onChangeRef.current({ target: { value: '' } });
                    }
                }
            }
        });

        return () => {
            if (fpRef.current) {
                fpRef.current.destroy();
            }
        };
    }, []);

    // Effect to update flatpickr if value or constraints change externally
    useEffect(() => {
        if (fpRef.current && value !== undefined) {
            fpRef.current.setDate(parseToDateObj(value), false);
        }
    }, [value]);

    useEffect(() => {
        if (fpRef.current && min) fpRef.current.set('minDate', parseToDateObj(min));
    }, [min]);

    useEffect(() => {
        if (fpRef.current && max) fpRef.current.set('maxDate', parseToDateObj(max));
    }, [max]);

    return (
        <input 
            type="text" 
            ref={inputRef}
            className={`form-control ${className}`}
            defaultValue={getDisplayValue(value)}
            {...props}
        />
    );
}
