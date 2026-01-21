import { useState } from 'react';
import { PhoneInput } from './components/ui/phone-input';

// Simple test component to verify phone input works with form data
export function TestRegisterForm() {
    const [formData, setFormData] = useState({
        country_code: '+256',
        phone_number: '',
        role: ''
    });

    const [selectedRole, setSelectedRole] = useState<string>('');
    const [countryCode, setCountryCode] = useState<string>('+256');
    const [phoneNumber, setPhoneNumber] = useState<string>('');

    const isPhoneRequired = selectedRole === 'guardian' || selectedRole === 'therapist';

    // Mock setData function similar to Inertia's
    const setData = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        console.log(`Setting ${key} to:`, value);
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Register Form Test</h2>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Role</label>
                    <select 
                        value={selectedRole}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSelectedRole(value);
                            setData('role', value);
                        }}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Select role</option>
                        <option value="guardian">Parent/Guardian</option>
                        <option value="therapist">Therapist</option>
                    </select>
                </div>

                <PhoneInput
                    label="Phone Number"
                    countryCode={countryCode}
                    phoneNumber={phoneNumber}
                    onCountryCodeChange={(code) => {
                        setCountryCode(code);
                        setData('country_code', code);
                    }}
                    onPhoneNumberChange={(phone) => {
                        setPhoneNumber(phone);
                        setData('phone_number', phone);
                    }}
                    required={isPhoneRequired}
                    placeholder="Enter your phone number"
                />

                <div className="mt-4 p-3 bg-gray-100 rounded">
                    <h3 className="font-medium mb-2">Form Data:</h3>
                    <pre className="text-sm">{JSON.stringify(formData, null, 2)}</pre>
                </div>

                <div className="text-sm text-gray-600">
                    Phone required: {isPhoneRequired ? 'Yes' : 'No'}
                </div>
            </div>
        </div>
    );
}