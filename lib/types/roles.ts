/**
 * User Role and Employment Type Definitions
 */

export type Role = 
  | 'representative'
  | 'company_admin'
  | 'company_manager'
  | 'company_support'
  | 'company_analyst'
  | 'chief_of_staff'
  | 'communications_director'
  | 'office_admin'
  | 'staff_member'
  | 'campaign_manager'
  | 'campaign_coordinator'
  | 'field_organizer'
  | 'volunteer_coordinator'
  | 'temp_staff'
  | 'intern'
  | 'volunteer'
  | 'constituent'
  | 'admin';

export type CompanyRole = 
  | 'company_admin'
  | 'company_manager'
  | 'company_support'
  | 'company_analyst';

export type RepRole = 
  | 'chief_of_staff'
  | 'communications_director'
  | 'office_admin'
  | 'staff_member';

export type PermanentRepRole = RepRole;

export type TemporaryRepRole = 
  | 'campaign_manager'
  | 'campaign_coordinator'
  | 'field_organizer'
  | 'volunteer_coordinator'
  | 'temp_staff'
  | 'intern'
  | 'volunteer';

export type EmploymentType = 
  | 'permanent'
  | 'temporary'
  | 'campaign'
  | 'seasonal'
  | 'volunteer';