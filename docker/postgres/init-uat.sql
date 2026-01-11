-- SafeSpace UAT Database Initialization Script

-- Create UAT database if it doesn't exist
SELECT 'CREATE DATABASE safespace_uat'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'safespace_uat')\gexec

-- Connect to the UAT database
\c safespace_uat;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create UAT-specific schemas
CREATE SCHEMA IF NOT EXISTS uat_monitoring;
CREATE SCHEMA IF NOT EXISTS uat_testing;

-- UAT Test Session Tracking Table
CREATE TABLE IF NOT EXISTS uat_monitoring.test_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_name VARCHAR(255) NOT NULL,
    tester_email VARCHAR(255) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'active',
    test_cases_executed INTEGER DEFAULT 0,
    test_cases_passed INTEGER DEFAULT 0,
    test_cases_failed INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- UAT Issue Tracking Table
CREATE TABLE IF NOT EXISTS uat_monitoring.issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_session_id UUID REFERENCES uat_monitoring.test_sessions(id),
    issue_title VARCHAR(255) NOT NULL,
    issue_description TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('Critical', 'High', 'Medium', 'Low')),
    category VARCHAR(50) NOT NULL,
    steps_to_reproduce TEXT,
    expected_behavior TEXT,
    actual_behavior TEXT,
    browser_info VARCHAR(255),
    user_role VARCHAR(50),
    status VARCHAR(20) DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Resolved', 'Closed')),
    assignee VARCHAR(255),
    resolution TEXT,
    screenshots JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- UAT Performance Metrics Table
CREATE TABLE IF NOT EXISTS uat_monitoring.performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_session_id UUID REFERENCES uat_monitoring.test_sessions(id),
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    response_time_ms INTEGER NOT NULL,
    memory_usage_mb DECIMAL(10,2),
    cpu_usage_percent DECIMAL(5,2),
    database_queries INTEGER,
    status_code INTEGER,
    user_role VARCHAR(50),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- UAT Test Case Results Table
CREATE TABLE IF NOT EXISTS uat_testing.test_case_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_session_id UUID REFERENCES uat_monitoring.test_sessions(id),
    test_case_id VARCHAR(100) NOT NULL,
    test_case_title VARCHAR(255) NOT NULL,
    requirement_id VARCHAR(50) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Not Started', 'In Progress', 'Passed', 'Failed', 'Blocked')),
    execution_time_minutes INTEGER,
    tester_notes TEXT,
    screenshots JSONB,
    executed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_test_sessions_status ON uat_monitoring.test_sessions(status);
CREATE INDEX IF NOT EXISTS idx_test_sessions_tester ON uat_monitoring.test_sessions(tester_email);
CREATE INDEX IF NOT EXISTS idx_issues_severity ON uat_monitoring.issues(severity);
CREATE INDEX IF NOT EXISTS idx_issues_status ON uat_monitoring.issues(status);
CREATE INDEX IF NOT EXISTS idx_performance_endpoint ON uat_monitoring.performance_metrics(endpoint);
CREATE INDEX IF NOT EXISTS idx_performance_timestamp ON uat_monitoring.performance_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_test_results_status ON uat_testing.test_case_results(status);
CREATE INDEX IF NOT EXISTS idx_test_results_requirement ON uat_testing.test_case_results(requirement_id);

-- Create functions for UAT monitoring
CREATE OR REPLACE FUNCTION uat_monitoring.update_test_session_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update test session statistics when test case results change
    UPDATE uat_monitoring.test_sessions 
    SET 
        test_cases_executed = (
            SELECT COUNT(*) 
            FROM uat_testing.test_case_results 
            WHERE test_session_id = NEW.test_session_id 
            AND status IN ('Passed', 'Failed')
        ),
        test_cases_passed = (
            SELECT COUNT(*) 
            FROM uat_testing.test_case_results 
            WHERE test_session_id = NEW.test_session_id 
            AND status = 'Passed'
        ),
        test_cases_failed = (
            SELECT COUNT(*) 
            FROM uat_testing.test_case_results 
            WHERE test_session_id = NEW.test_session_id 
            AND status = 'Failed'
        ),
        updated_at = NOW()
    WHERE id = NEW.test_session_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic statistics updates
DROP TRIGGER IF EXISTS trigger_update_test_session_stats ON uat_testing.test_case_results;
CREATE TRIGGER trigger_update_test_session_stats
    AFTER INSERT OR UPDATE ON uat_testing.test_case_results
    FOR EACH ROW
    EXECUTE FUNCTION uat_monitoring.update_test_session_stats();

-- Create view for UAT dashboard
CREATE OR REPLACE VIEW uat_monitoring.dashboard_summary AS
SELECT 
    ts.session_name,
    ts.tester_email,
    ts.user_role,
    ts.status as session_status,
    ts.start_time,
    ts.end_time,
    ts.test_cases_executed,
    ts.test_cases_passed,
    ts.test_cases_failed,
    CASE 
        WHEN ts.test_cases_executed > 0 
        THEN ROUND((ts.test_cases_passed::DECIMAL / ts.test_cases_executed) * 100, 2)
        ELSE 0 
    END as pass_rate_percent,
    COUNT(i.id) as total_issues,
    COUNT(CASE WHEN i.severity = 'Critical' THEN 1 END) as critical_issues,
    COUNT(CASE WHEN i.severity = 'High' THEN 1 END) as high_issues,
    AVG(pm.response_time_ms) as avg_response_time_ms
FROM uat_monitoring.test_sessions ts
LEFT JOIN uat_monitoring.issues i ON ts.id = i.test_session_id
LEFT JOIN uat_monitoring.performance_metrics pm ON ts.id = pm.test_session_id
GROUP BY ts.id, ts.session_name, ts.tester_email, ts.user_role, ts.status, 
         ts.start_time, ts.end_time, ts.test_cases_executed, 
         ts.test_cases_passed, ts.test_cases_failed;

-- Grant permissions to application user
GRANT USAGE ON SCHEMA uat_monitoring TO safespace_uat;
GRANT USAGE ON SCHEMA uat_testing TO safespace_uat;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA uat_monitoring TO safespace_uat;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA uat_testing TO safespace_uat;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA uat_monitoring TO safespace_uat;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA uat_testing TO safespace_uat;

-- Insert initial UAT configuration data
INSERT INTO uat_monitoring.test_sessions (
    session_name, 
    tester_email, 
    user_role, 
    status
) VALUES 
('Initial UAT Setup Validation', 'uat-coordinator@safespace.com', 'admin', 'completed'),
('Environment Health Check', 'system@safespace.com', 'system', 'completed')
ON CONFLICT DO NOTHING;

-- Create sample test case templates
INSERT INTO uat_testing.test_case_results (
    test_case_id,
    test_case_title,
    requirement_id,
    user_role,
    status,
    test_session_id
) VALUES 
('TC001', 'Admin Login and Dashboard Access', '1.1', 'admin', 'Not Started', 
 (SELECT id FROM uat_monitoring.test_sessions WHERE session_name = 'Initial UAT Setup Validation')),
('TC002', 'Therapist Registration and Approval', '1.2', 'therapist', 'Not Started',
 (SELECT id FROM uat_monitoring.test_sessions WHERE session_name = 'Initial UAT Setup Validation')),
('TC003', 'Guardian Child Account Creation', '1.3', 'guardian', 'Not Started',
 (SELECT id FROM uat_monitoring.test_sessions WHERE session_name = 'Initial UAT Setup Validation')),
('TC004', 'Child Mood Tracking Functionality', '3.1', 'child', 'Not Started',
 (SELECT id FROM uat_monitoring.test_sessions WHERE session_name = 'Initial UAT Setup Validation'))
ON CONFLICT DO NOTHING;

-- Log successful initialization
INSERT INTO uat_monitoring.performance_metrics (
    test_session_id,
    endpoint,
    method,
    response_time_ms,
    status_code,
    user_role
) VALUES (
    (SELECT id FROM uat_monitoring.test_sessions WHERE session_name = 'Environment Health Check'),
    '/health',
    'GET',
    50,
    200,
    'system'
);

-- Final message
DO $$
BEGIN
    RAISE NOTICE 'SafeSpace UAT database initialization completed successfully!';
    RAISE NOTICE 'Created schemas: uat_monitoring, uat_testing';
    RAISE NOTICE 'Created tables: test_sessions, issues, performance_metrics, test_case_results';
    RAISE NOTICE 'Created views: dashboard_summary';
    RAISE NOTICE 'UAT environment is ready for acceptance testing.';
END $$;