// Simple verification script to check if the register.tsx file has the correct structure

const fs = require('fs');
const path = require('path');

const registerFile = path.join(__dirname, 'resources/js/pages/auth/register.tsx');

try {
    const content = fs.readFileSync(registerFile, 'utf8');
    
    // Check if setData is properly scoped within the Form render prop
    const hasCorrectStructure = content.includes('({ processing, errors, data, setData }) => {');
    const hasPhoneCallback = content.includes('setData(\'phone_number\', phone)');
    const hasCountryCallback = content.includes('setData(\'country_code\', code)');
    const hasRoleCallback = content.includes('setData(\'role\', value)');
    
    console.log('Register.tsx Fix Verification:');
    console.log('✓ Correct Form structure:', hasCorrectStructure);
    console.log('✓ Phone number callback:', hasPhoneCallback);
    console.log('✓ Country code callback:', hasCountryCallback);
    console.log('✓ Role callback:', hasRoleCallback);
    
    if (hasCorrectStructure && hasPhoneCallback && hasCountryCallback && hasRoleCallback) {
        console.log('\n🎉 All fixes are properly applied!');
        console.log('\nNext steps:');
        console.log('1. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)');
        console.log('2. Restart Vite dev server: npm run dev');
        console.log('3. If still having issues, try: rm -rf node_modules/.vite && npm run dev');
    } else {
        console.log('\n❌ Some fixes are missing. Please check the file manually.');
    }
    
} catch (error) {
    console.error('Error reading register.tsx:', error.message);
}