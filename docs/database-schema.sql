-- Red Cross 5266 Next Generation Database Schema
-- PostgreSQL with TimescaleDB extensions for time-series data
-- Designed for real-time operations, scalability, and data integrity

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "timescaledb";

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Disaster Relief Operations
CREATE TABLE disasters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dr_number VARCHAR(20) UNIQUE NOT NULL, -- e.g., DR-2024-FL-001
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- Hurricane, Flood, Fire, etc.
    status VARCHAR(20) DEFAULT 'active', -- active, closed, planning
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    affected_states TEXT[],
    affected_counties TEXT[],
    headquarters_location JSONB,
    geo_bounds GEOMETRY(POLYGON, 4326),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Districts/Zones within a disaster operation
CREATE TABLE districts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    disaster_id UUID REFERENCES disasters(id) ON DELETE CASCADE,
    district_number INTEGER NOT NULL,
    name VARCHAR(255),
    coverage_area GEOMETRY(POLYGON, 4326),
    headquarters_location JSONB,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(disaster_id, district_number)
);

-- =====================================================
-- SHELTER OPERATIONS
-- =====================================================

CREATE TABLE shelters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    disaster_id UUID REFERENCES disasters(id) ON DELETE CASCADE,
    district_id UUID REFERENCES districts(id),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50), -- Red Cross Managed, Partner Managed, etc.
    status VARCHAR(20) DEFAULT 'active', -- active, standby, closed
    capacity INTEGER NOT NULL,
    current_occupancy INTEGER DEFAULT 0,
    location GEOGRAPHY(POINT, 4326),
    address JSONB,
    amenities TEXT[],
    opened_at TIMESTAMP,
    closed_at TIMESTAMP,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Time-series data for shelter occupancy
CREATE TABLE shelter_occupancy_log (
    shelter_id UUID REFERENCES shelters(id) ON DELETE CASCADE,
    recorded_at TIMESTAMP NOT NULL,
    occupancy_count INTEGER NOT NULL,
    overnight_stays INTEGER,
    new_registrations INTEGER,
    exits INTEGER,
    staff_count INTEGER,
    notes TEXT,
    PRIMARY KEY (shelter_id, recorded_at)
);

-- Convert to TimescaleDB hypertable for efficient time-series queries
SELECT create_hypertable('shelter_occupancy_log', 'recorded_at');

-- =====================================================
-- FEEDING OPERATIONS
-- =====================================================

CREATE TABLE feeding_sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    disaster_id UUID REFERENCES disasters(id) ON DELETE CASCADE,
    district_id UUID REFERENCES districts(id),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50), -- Fixed, Mobile, Kitchen
    status VARCHAR(20) DEFAULT 'active',
    location GEOGRAPHY(POINT, 4326),
    partner_org VARCHAR(255), -- Southern Baptist, etc.
    capacity_per_meal INTEGER,
    operating_hours JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Time-series feeding data
CREATE TABLE feeding_log (
    site_id UUID REFERENCES feeding_sites(id) ON DELETE CASCADE,
    recorded_at TIMESTAMP NOT NULL,
    meals_served INTEGER DEFAULT 0,
    snacks_served INTEGER DEFAULT 0,
    beverages_served INTEGER DEFAULT 0,
    meal_type VARCHAR(20), -- breakfast, lunch, dinner
    serving_method VARCHAR(50), -- drive-through, walk-up, delivery
    weather_conditions JSONB,
    wait_time_minutes INTEGER,
    notes TEXT,
    PRIMARY KEY (site_id, recorded_at)
);

SELECT create_hypertable('feeding_log', 'recorded_at');

-- =====================================================
-- STAFF AND VOLUNTEERS
-- =====================================================

CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    disaster_id UUID REFERENCES disasters(id) ON DELETE CASCADE,
    badge_number VARCHAR(50) UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    role VARCHAR(100),
    classification VARCHAR(50), -- Employee, Volunteer, Partner, Contractor
    district_id UUID REFERENCES districts(id),
    status VARCHAR(20) DEFAULT 'active',
    skills TEXT[],
    certifications JSONB,
    emergency_contact JSONB,
    checked_in_at TIMESTAMP,
    checked_out_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Staff wellness and health tracking
CREATE TABLE staff_wellness_log (
    staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
    recorded_at TIMESTAMP NOT NULL,
    status VARCHAR(20), -- healthy, ill, injured, hospitalized
    temperature DECIMAL(4,1),
    symptoms TEXT[],
    medical_attention_needed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    reported_by UUID REFERENCES staff(id),
    PRIMARY KEY (staff_id, recorded_at)
);

SELECT create_hypertable('staff_wellness_log', 'recorded_at');

-- =====================================================
-- LOGISTICS AND SUPPLIES
-- =====================================================

CREATE TABLE warehouses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    disaster_id UUID REFERENCES disasters(id) ON DELETE CASCADE,
    district_id UUID REFERENCES districts(id),
    name VARCHAR(255) NOT NULL,
    location GEOGRAPHY(POINT, 4326),
    capacity_sqft INTEGER,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    warehouse_id UUID REFERENCES warehouses(id) ON DELETE CASCADE,
    item_code VARCHAR(50) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(100), -- Shelter Supplies, Cleanup Kits, Medical, etc.
    unit_of_measure VARCHAR(20),
    quantity_on_hand INTEGER DEFAULT 0,
    reorder_point INTEGER,
    reorder_quantity INTEGER,
    last_restocked TIMESTAMP,
    expiration_date DATE,
    metadata JSONB
);

-- Distribution tracking
CREATE TABLE distribution_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    disaster_id UUID REFERENCES disasters(id) ON DELETE CASCADE,
    district_id UUID REFERENCES districts(id),
    distributed_at TIMESTAMP NOT NULL,
    distribution_type VARCHAR(50), -- Fixed Site, Mobile Route, Direct Delivery
    location GEOGRAPHY(POINT, 4326),
    items JSONB, -- Array of {item_code, quantity, unit}
    households_served INTEGER,
    individuals_served INTEGER,
    recorded_by UUID REFERENCES staff(id),
    notes TEXT
);

-- =====================================================
-- VEHICLES AND TRANSPORTATION
-- =====================================================

CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    disaster_id UUID REFERENCES disasters(id) ON DELETE CASCADE,
    vehicle_number VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(50), -- ERV, Box Truck, Van, etc.
    status VARCHAR(20) DEFAULT 'available', -- available, deployed, maintenance
    current_location GEOGRAPHY(POINT, 4326),
    assigned_district_id UUID REFERENCES districts(id),
    capacity JSONB, -- {passengers: 0, cargo_cubic_ft: 0}
    mileage INTEGER,
    last_maintenance DATE,
    fuel_level_percent INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vehicle_deployment_log (
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    deployed_at TIMESTAMP NOT NULL,
    returned_at TIMESTAMP,
    mission_type VARCHAR(100),
    miles_driven INTEGER,
    fuel_consumed DECIMAL(10,2),
    assigned_staff UUID[] DEFAULT '{}',
    route_taken GEOGRAPHY(LINESTRING, 4326),
    notes TEXT,
    PRIMARY KEY (vehicle_id, deployed_at)
);

SELECT create_hypertable('vehicle_deployment_log', 'deployed_at');

-- =====================================================
-- CASE MANAGEMENT
-- =====================================================

CREATE TABLE cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    disaster_id UUID REFERENCES disasters(id) ON DELETE CASCADE,
    case_number VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'open', -- open, in_review, closed
    priority VARCHAR(20) DEFAULT 'normal', -- critical, high, normal, low
    household_id UUID,
    primary_contact JSONB,
    household_members JSONB[],
    address JSONB,
    location GEOGRAPHY(POINT, 4326),
    needs_assessment JSONB,
    assistance_provided JSONB[],
    assigned_to UUID REFERENCES staff(id),
    opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP,
    metadata JSONB
);

-- Financial assistance tracking
CREATE TABLE financial_assistance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    assistance_type VARCHAR(50), -- Immediate, Supplemental, etc.
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50), -- EFT, Client Assistance Card
    approved_by UUID REFERENCES staff(id),
    approved_at TIMESTAMP,
    disbursed_at TIMESTAMP,
    notes TEXT
);

-- =====================================================
-- REAL-TIME METRICS (Aggregated for Performance)
-- =====================================================

CREATE TABLE operational_metrics (
    disaster_id UUID REFERENCES disasters(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    metric_hour INTEGER CHECK (metric_hour >= 0 AND metric_hour <= 23),
    
    -- Shelter Metrics
    total_shelters_open INTEGER DEFAULT 0,
    total_shelter_capacity INTEGER DEFAULT 0,
    total_shelter_occupancy INTEGER DEFAULT 0,
    shelter_overnight_stays INTEGER DEFAULT 0,
    
    -- Feeding Metrics
    meals_served INTEGER DEFAULT 0,
    snacks_served INTEGER DEFAULT 0,
    feeding_sites_active INTEGER DEFAULT 0,
    
    -- Staff Metrics
    staff_deployed INTEGER DEFAULT 0,
    volunteers_active INTEGER DEFAULT 0,
    staff_hours_worked DECIMAL(10,2) DEFAULT 0,
    
    -- Logistics Metrics
    cleanup_kits_distributed INTEGER DEFAULT 0,
    emergency_supplies_distributed INTEGER DEFAULT 0,
    households_assisted INTEGER DEFAULT 0,
    
    -- Vehicle Metrics
    vehicles_deployed INTEGER DEFAULT 0,
    total_miles_driven INTEGER DEFAULT 0,
    
    -- Case Metrics
    cases_opened INTEGER DEFAULT 0,
    cases_closed INTEGER DEFAULT 0,
    financial_assistance_amount DECIMAL(12,2) DEFAULT 0,
    
    -- Calculated fields
    occupancy_rate DECIMAL(5,2), -- percentage
    meal_distribution_rate DECIMAL(10,2), -- meals per hour
    
    PRIMARY KEY (disaster_id, metric_date, metric_hour)
);

-- =====================================================
-- INCIDENT ACTION PLAN (IAP) GENERATION
-- =====================================================

CREATE TABLE incident_action_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    disaster_id UUID REFERENCES disasters(id) ON DELETE CASCADE,
    plan_number INTEGER NOT NULL,
    operational_period_start TIMESTAMP NOT NULL,
    operational_period_end TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'draft', -- draft, published, superseded
    
    -- Content sections
    directors_message TEXT,
    priorities JSONB[], -- Array of {priority_num, description}
    objectives JSONB[], -- Array of {objective_num, description, status}
    work_assignments JSONB[], -- Array of assignments
    
    -- Metadata
    prepared_by UUID REFERENCES staff(id),
    approved_by UUID REFERENCES staff(id),
    published_at TIMESTAMP,
    document_url TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(disaster_id, plan_number)
);

-- =====================================================
-- AUDIT AND COMPLIANCE
-- =====================================================

CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id UUID REFERENCES staff(id),
    action VARCHAR(50) NOT NULL, -- CREATE, UPDATE, DELETE, VIEW
    table_name VARCHAR(100),
    record_id UUID,
    changes JSONB,
    ip_address INET,
    user_agent TEXT
);

CREATE INDEX idx_audit_log_timestamp ON audit_log(timestamp DESC);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Disaster indexes
CREATE INDEX idx_disasters_status ON disasters(status);
CREATE INDEX idx_disasters_dates ON disasters(start_date, end_date);

-- Shelter indexes
CREATE INDEX idx_shelters_disaster ON shelters(disaster_id);
CREATE INDEX idx_shelters_status ON shelters(status);
CREATE INDEX idx_shelters_location ON shelters USING GIST(location);

-- Staff indexes
CREATE INDEX idx_staff_disaster ON staff(disaster_id);
CREATE INDEX idx_staff_status ON staff(status);
CREATE INDEX idx_staff_role ON staff(role);

-- Case indexes
CREATE INDEX idx_cases_disaster ON cases(disaster_id);
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_cases_priority ON cases(priority);

-- Metrics indexes
CREATE INDEX idx_metrics_disaster_date ON operational_metrics(disaster_id, metric_date DESC);

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

CREATE OR REPLACE VIEW current_shelter_status AS
SELECT 
    s.id,
    s.name,
    s.capacity,
    s.current_occupancy,
    ROUND((s.current_occupancy::DECIMAL / NULLIF(s.capacity, 0)) * 100, 2) as occupancy_rate,
    s.status,
    d.name as district_name
FROM shelters s
LEFT JOIN districts d ON s.district_id = d.id
WHERE s.status = 'active';

CREATE OR REPLACE VIEW daily_operational_summary AS
SELECT 
    m.disaster_id,
    m.metric_date,
    SUM(m.meals_served) as total_meals,
    SUM(m.shelter_overnight_stays) as total_overnight_stays,
    AVG(m.occupancy_rate) as avg_occupancy_rate,
    SUM(m.cases_opened) as total_cases_opened,
    SUM(m.financial_assistance_amount) as total_assistance
FROM operational_metrics m
GROUP BY m.disaster_id, m.metric_date
ORDER BY m.metric_date DESC;

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_disasters_updated_at BEFORE UPDATE ON disasters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shelters_updated_at BEFORE UPDATE ON shelters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate real-time metrics
CREATE OR REPLACE FUNCTION calculate_hourly_metrics(p_disaster_id UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO operational_metrics (
        disaster_id, metric_date, metric_hour,
        total_shelters_open, total_shelter_capacity, total_shelter_occupancy
    )
    SELECT 
        p_disaster_id,
        CURRENT_DATE,
        EXTRACT(HOUR FROM CURRENT_TIMESTAMP),
        COUNT(*) FILTER (WHERE status = 'active'),
        SUM(capacity),
        SUM(current_occupancy)
    FROM shelters
    WHERE disaster_id = p_disaster_id
    ON CONFLICT (disaster_id, metric_date, metric_hour)
    DO UPDATE SET
        total_shelters_open = EXCLUDED.total_shelters_open,
        total_shelter_capacity = EXCLUDED.total_shelter_capacity,
        total_shelter_occupancy = EXCLUDED.total_shelter_occupancy;
END;
$$ LANGUAGE plpgsql;