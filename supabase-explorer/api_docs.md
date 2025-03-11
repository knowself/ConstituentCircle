# Supabase API Documentation

Base URL: `https://fiykrwvcpbchgznncriw.supabase.co`

## profiles

### Schema

| Column | Type |
|--------|------|
| id | string |
| email | string |
| role | string |
| displayname | string |
| metadata | object |
| created_at | string |

### Get all profiles

```javascript
const { data, error } = await supabase
  .from('profiles')
  .select('*');
```

### Get profiles by ID

```javascript
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', 123);
```

### Get profiles with filters

```javascript
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('column_name', 'value')
  .order('created_at', { ascending: false });
```

### Insert profiles

```javascript
const { data, error } = await supabase
  .from('profiles')
  .insert([{ /* fields */ }]);
```

### Update profiles

```javascript
const { data, error } = await supabase
  .from('profiles')
  .update({ /* fields */ })
  .eq('id', 123);
```

### Delete profiles

```javascript
const { data, error } = await supabase
  .from('profiles')
  .delete()
  .eq('id', 123);
```

## representatives

### Schema

| Column | Type |
|--------|------|
| id | string |
| email | string |
| full_name | string |
| district | string |
| office_type | string |
| created_at | string |

### Get all representatives

```javascript
const { data, error } = await supabase
  .from('representatives')
  .select('*');
```

### Get representatives by ID

```javascript
const { data, error } = await supabase
  .from('representatives')
  .select('*')
  .eq('id', 123);
```

### Get representatives with filters

```javascript
const { data, error } = await supabase
  .from('representatives')
  .select('*')
  .eq('column_name', 'value')
  .order('created_at', { ascending: false });
```

### Insert representatives

```javascript
const { data, error } = await supabase
  .from('representatives')
  .insert([{ /* fields */ }]);
```

### Update representatives

```javascript
const { data, error } = await supabase
  .from('representatives')
  .update({ /* fields */ })
  .eq('id', 123);
```

### Delete representatives

```javascript
const { data, error } = await supabase
  .from('representatives')
  .delete()
  .eq('id', 123);
```

## constituents

### Schema

| Column | Type |
|--------|------|
| id | string |
| email | string |
| full_name | string |
| district | string |
| preferences | object |
| created_at | string |

### Get all constituents

```javascript
const { data, error } = await supabase
  .from('constituents')
  .select('*');
```

### Get constituents by ID

```javascript
const { data, error } = await supabase
  .from('constituents')
  .select('*')
  .eq('id', 123);
```

### Get constituents with filters

```javascript
const { data, error } = await supabase
  .from('constituents')
  .select('*')
  .eq('column_name', 'value')
  .order('created_at', { ascending: false });
```

### Insert constituents

```javascript
const { data, error } = await supabase
  .from('constituents')
  .insert([{ /* fields */ }]);
```

### Update constituents

```javascript
const { data, error } = await supabase
  .from('constituents')
  .update({ /* fields */ })
  .eq('id', 123);
```

### Delete constituents

```javascript
const { data, error } = await supabase
  .from('constituents')
  .delete()
  .eq('id', 123);
```

## communications

### Schema

| Column | Type |
|--------|------|
| id | string |
| representative_id | string |
| constituent_id | string |
| message_type | string |
| content | string |
| channel | string |
| status | string |
| sent_at | string |
| created_at | string |

### Get all communications

```javascript
const { data, error } = await supabase
  .from('communications')
  .select('*');
```

### Get communications by ID

```javascript
const { data, error } = await supabase
  .from('communications')
  .select('*')
  .eq('id', 123);
```

### Get communications with filters

```javascript
const { data, error } = await supabase
  .from('communications')
  .select('*')
  .eq('column_name', 'value')
  .order('created_at', { ascending: false });
```

### Insert communications

```javascript
const { data, error } = await supabase
  .from('communications')
  .insert([{ /* fields */ }]);
```

### Update communications

```javascript
const { data, error } = await supabase
  .from('communications')
  .update({ /* fields */ })
  .eq('id', 123);
```

### Delete communications

```javascript
const { data, error } = await supabase
  .from('communications')
  .delete()
  .eq('id', 123);
```

## analytics

### Schema

| Column | Type |
|--------|------|
| id | string |
| period | string |
| metrics | object |
| engagement | object |
| demographics | object |
| trends | object |
| timestamp | string |
| metadata | object |

### Get all analytics

```javascript
const { data, error } = await supabase
  .from('analytics')
  .select('*');
```

### Get analytics by ID

```javascript
const { data, error } = await supabase
  .from('analytics')
  .select('*')
  .eq('id', 123);
```

### Get analytics with filters

```javascript
const { data, error } = await supabase
  .from('analytics')
  .select('*')
  .eq('column_name', 'value')
  .order('created_at', { ascending: false });
```

### Insert analytics

```javascript
const { data, error } = await supabase
  .from('analytics')
  .insert([{ /* fields */ }]);
```

### Update analytics

```javascript
const { data, error } = await supabase
  .from('analytics')
  .update({ /* fields */ })
  .eq('id', 123);
```

### Delete analytics

```javascript
const { data, error } = await supabase
  .from('analytics')
  .delete()
  .eq('id', 123);
```

## groups

### Schema

| Column | Type |
|--------|------|
| id | string |
| name | string |
| description | string |
| type | string |
| settings | object |
| metadata | object |
| created_at | string |
| updated_at | object |
| representative_id | string |
| analytics | object |

### Get all groups

```javascript
const { data, error } = await supabase
  .from('groups')
  .select('*');
```

### Get groups by ID

```javascript
const { data, error } = await supabase
  .from('groups')
  .select('*')
  .eq('id', 123);
```

### Get groups with filters

```javascript
const { data, error } = await supabase
  .from('groups')
  .select('*')
  .eq('column_name', 'value')
  .order('created_at', { ascending: false });
```

### Insert groups

```javascript
const { data, error } = await supabase
  .from('groups')
  .insert([{ /* fields */ }]);
```

### Update groups

```javascript
const { data, error } = await supabase
  .from('groups')
  .update({ /* fields */ })
  .eq('id', 123);
```

### Delete groups

```javascript
const { data, error } = await supabase
  .from('groups')
  .delete()
  .eq('id', 123);
```

## group_members

### Schema

| Column | Type |
|--------|------|
| group_id | string |
| constituent_id | string |
| role | string |
| joined_at | string |

### Get all group_members

```javascript
const { data, error } = await supabase
  .from('group_members')
  .select('*');
```

### Get group_members by ID

```javascript
const { data, error } = await supabase
  .from('group_members')
  .select('*')
  .eq('id', 123);
```

### Get group_members with filters

```javascript
const { data, error } = await supabase
  .from('group_members')
  .select('*')
  .eq('column_name', 'value')
  .order('created_at', { ascending: false });
```

### Insert group_members

```javascript
const { data, error } = await supabase
  .from('group_members')
  .insert([{ /* fields */ }]);
```

### Update group_members

```javascript
const { data, error } = await supabase
  .from('group_members')
  .update({ /* fields */ })
  .eq('id', 123);
```

### Delete group_members

```javascript
const { data, error } = await supabase
  .from('group_members')
  .delete()
  .eq('id', 123);
```

## Relationships

The following relationships can be used in your queries:

No relationships were automatically detected. You may need to define them manually in your queries.

## Additional Supabase Features

### Authentication

```javascript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'example@email.com',
  password: 'example-password',
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'example@email.com',
  password: 'example-password',
});

// Sign out
const { error } = await supabase.auth.signOut();
```

### Storage

```javascript
// Upload file
const { data, error } = await supabase.storage
  .from('bucket-name')
  .upload('file-path', file);

// Download file
const { data, error } = await supabase.storage
  .from('bucket-name')
  .download('file-path');
```

