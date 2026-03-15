-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Database Schema for GuardianSwitch

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    api_key UUID DEFAULT uuid_generate_v4() UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pulse Logs (Record of every check-in)
CREATE TABLE pulses (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    device_name TEXT,
    device_os TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Monitors (Settings for the Dead Man's Switch)
CREATE TABLE monitors (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    trusted_email TEXT NOT NULL,
    emergency_message TEXT,
    threshold_hours INTEGER DEFAULT 24,
    last_alert_sent_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    last_pulse_at TIMESTAMP WITH TIME ZONE
);

-- Index for performance on check-silence queries
CREATE INDEX idx_monitors_last_pulse ON monitors(last_pulse_at);
