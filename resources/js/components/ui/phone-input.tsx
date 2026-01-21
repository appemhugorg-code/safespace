import React from 'react';
import { Label } from './label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Input } from './input';
import InputError from '../input-error';

interface PhoneInputProps {
    label?: string;
    countryCode: string;
    phoneNumber: string;
    onCountryCodeChange: (code: string) => void;
    onPhoneNumberChange: (phone: string) => void;
    required?: boolean;
    error?: string;
    placeholder?: string;
    disabled?: boolean;
}

const countryCodes = [
    { code: '+1', country: 'US', name: 'United States' },
    { code: '+44', country: 'GB', name: 'United Kingdom' },
    { code: '+256', country: 'UG', name: 'Uganda' },
    { code: '+254', country: 'KE', name: 'Kenya' },
    { code: '+255', country: 'TZ', name: 'Tanzania' },
    { code: '+250', country: 'RW', name: 'Rwanda' },
    { code: '+27', country: 'ZA', name: 'South Africa' },
    { code: '+234', country: 'NG', name: 'Nigeria' },
    { code: '+233', country: 'GH', name: 'Ghana' },
    { code: '+91', country: 'IN', name: 'India' },
    { code: '+86', country: 'CN', name: 'China' },
    { code: '+81', country: 'JP', name: 'Japan' },
    { code: '+49', country: 'DE', name: 'Germany' },
    { code: '+33', country: 'FR', name: 'France' },
    { code: '+39', country: 'IT', name: 'Italy' },
    { code: '+34', country: 'ES', name: 'Spain' },
    { code: '+61', country: 'AU', name: 'Australia' },
    { code: '+55', country: 'BR', name: 'Brazil' },
    { code: '+52', country: 'MX', name: 'Mexico' },
    { code: '+7', country: 'RU', name: 'Russia' },
];

export function PhoneInput({
    label,
    countryCode,
    phoneNumber,
    onCountryCodeChange,
    onPhoneNumberChange,
    required = false,
    error,
    placeholder = "Enter phone number",
    disabled = false,
}: PhoneInputProps) {
    return (
        <div className="grid gap-sm">
            {label && (
                <Label className="text-body font-medium">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </Label>
            )}
            
            <div className="flex gap-2">
                {/* Country Code Selector */}
                <Select
                    value={countryCode}
                    onValueChange={onCountryCodeChange}
                    disabled={disabled}
                >
                    <SelectTrigger className="w-32 touch-target">
                        <SelectValue placeholder="+256" />
                    </SelectTrigger>
                    <SelectContent>
                        {countryCodes.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-mono">{country.code}</span>
                                    <span className="text-xs text-gray-500">{country.country}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Phone Number Input */}
                <Input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => onPhoneNumberChange(e.target.value)}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    className="flex-1 touch-target"
                    autoComplete="tel"
                />
            </div>

            {error && <InputError message={error} />}
            
            {required && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    We'll use this number for important account notifications and emergency contact.
                </p>
            )}
        </div>
    );
}