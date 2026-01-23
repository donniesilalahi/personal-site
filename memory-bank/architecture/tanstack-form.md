# TanStack Form Reference

**Library**: TanStack Form (`@tanstack/react-form`)
**Version**: v1.x
**Purpose**: Type-safe form state management with validation

## Overview

TanStack Form provides:

- **Full TypeScript inference** for form data and validation
- **Headless UI** - You control markup entirely
- **Client and server validation** with Zod integration
- **Subscription-based updates** for optimal performance
- **No uncontrolled inputs** - Fully controlled form state

## Core Concepts

### Form Setup

```tsx
import { useForm, formOptions } from '@tanstack/react-form'
import { z } from 'zod'

const formOpts = formOptions({
  defaultValues: {
    name: '',
    email: '',
    message: '',
  },
  validators: {
    onChange: z.object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      email: z.string().email('Invalid email address'),
      message: z.string().min(10, 'Message must be at least 10 characters'),
    }),
  },
})

function ContactForm() {
  const form = useForm(formOpts)

  return <FormUI form={form} />
}
```

### Form Component

```tsx
import { Form } from '@tanstack/react-form'

function FormUI({ form }) {
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <form.Field name="name">
        {(field) => (
          <div>
            <label htmlFor={field.name}>Name</label>
            <input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
            {field.state.meta.errors.map((err) => (
              <span key={err}>{err}</span>
            ))}
          </div>
        )}
      </form.Field>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <button type="submit" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send'}
          </button>
        )}
      </form.Subscribe>
    </Form>
  )
}
```

## Validation

### Zod Validation

```tsx
const formOpts = formOptions({
  defaultValues: {
    name: '',
    email: '',
    age: 0,
  },
  validators: {
    onChange: z.object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      email: z.string().email('Invalid email'),
      age: z.number().min(18, 'Must be 18 or older'),
    }),
    onSubmit: z.object({
      // Additional submit-time validation
      terms: z.literal(true, {
        errorMap: () => ({ message: 'You must accept the terms' }),
      }),
    }),
  },
})
```

### Field-Level Validation

```tsx
<form.Field
  name="email"
  validators={{
    onChange: ({ value }) =>
      !value.includes('@') ? 'Must be a valid email' : undefined,
    onBlur: ({ value }) =>
      value.length < 5 ? 'Email is too short' : undefined,
  }}
>
  {(field) => (
    <input
      value={field.state.value}
      onChange={field.handleChange}
      onBlur={field.handleBlur}
    />
  )}
</form.Field>
```

### Async Validation

```tsx
const formOpts = formOptions({
  defaultValues: { email: '' },
  validators: {
    onChangeAsync: z.object({
      email: z.string().email(),
    }),
    onChangeAsyncDebounceMs: 300,
  },
})

// Server-side async validation
<form.Field
  name="email"
  validators={{
    onChangeAsync: async ({ value }) => {
      const exists = await checkEmailExists(value)
      if (exists) return 'Email already registered'
    },
    onChangeAsyncDebounceMs: 500,
  }}
>
```

## Server Validation

### Server Validation with TanStack Start

```tsx
// Server function for validation
const validateContactForm = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      name: z.string().min(2),
      email: z.string().email(),
      message: z.string().min(10),
    }),
  )
  .handler(async ({ data }) => {
    // Server-only checks
    const existing = await db.contacts.find({ email: data.email })
    if (existing) {
      return { fields: { email: 'Email already registered' } }
    }
  })

// Client form with server validation
function ContactForm() {
  const form = useForm({
    ...formOpts,
    onSubmit: async ({ value }) => {
      const serverValidation = await validateContactForm({ data: value })
      if (serverValidation) {
        form.setErrorMap(serverValidation)
        return
      }
      await submitContact(value)
      form.reset()
    },
  })
}
```

## Form Instance API

### Form Methods

| Method                  | Description              |
| ----------------------- | ------------------------ |
| `handleSubmit()`        | Validate and submit form |
| `reset()`               | Reset to default values  |
| `setErrorMap(errors)`   | Set field errors         |
| `setValue(name, value)` | Set field value          |
| `getFieldValue(name)`   | Get field value          |
| `validateField(name)`   | Validate specific field  |
| `validate()`            | Validate all fields      |

### Form State

```tsx
form.state
// ├── values: { name: '', email: '', ... }
// ├── errors: { name: ['error'], email: [], ... }
// ├── touchedFields: { name: true, email: false, ... }
// ├── dirtyFields: { name: true, ... }
// ├── isValid: boolean
// ├── isSubmitting: boolean
// ├── isSubmitted: boolean
// └── submitCount: number
```

## Field Component

### Props

| Prop         | Type                   | Description                         |
| ------------ | ---------------------- | ----------------------------------- |
| `name`       | `string`               | Field name (dot notation supported) |
| `validators` | `FieldValidators`      | Field-specific validators           |
| `children`   | `(field) => ReactNode` | Render function                     |

### Field API

```tsx
field.state
// ├── value: T
// ├── error: string | undefined
// ├── errors: string[]
// ├── isValid: boolean
// ├── isValidating: boolean
// ├── isTouched: boolean
// └── isDirty: boolean

field.handleChange(value)
field.handleBlur()
field.getValue()
field.setValue(value)
field.validate()
```

## Subscribe Component

Subscribe to form state changes:

```tsx
<form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting, state.errors]}>
  {([canSubmit, isSubmitting, errors]) => (
    <button disabled={!canSubmit || isSubmitting}>
      {isSubmitting ? 'Submitting...' : 'Submit'}
    </button>
    {errors.length > 0 && <ErrorList errors={errors} />}
  )}
</form.Subscribe>
```

## Array Fields

```tsx
function ArrayFieldForm() {
  const form = useForm({
    defaultValues: {
      todos: [{ text: '', completed: false }],
    },
  })

  return (
    <form.Field name="todos">
      {(field) => (
        <>
          {field.state.value.map((_, index) => (
            <form.Field key={index} name={`todos.${index}.text`}>
              {(subfield) => (
                <input
                  value={subfield.state.value}
                  onChange={subfield.handleChange}
                />
              )}
            </form.Field>
          ))}
          <button
            type="button"
            onClick={() => {
              field.setValue([
                ...field.state.value,
                { text: '', completed: false },
              ])
            }}
          >
            Add Todo
          </button>
        </>
      )}
    </form.Field>
  )
}
```

## Integration Patterns

### With TanStack Query

```tsx
function EditCampaignForm({ campaignId }) {
  const queryClient = useQueryClient()

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      targetAmount: 0,
    },
    onSubmit: async (formApi) => {
      await updateCampaign(campaignId, formApi.value)
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
    },
  })

  // Initialize with query data
  const { data: campaign } = useQuery({
    queryKey: ['campaigns', campaignId],
    queryFn: () => fetchCampaign(campaignId),
    onSuccess: (campaign) => {
      form.setValue('title', campaign.title)
      form.setValue('description', campaign.description)
      form.setValue('targetAmount', campaign.targetAmount)
    },
  })

  return <FormUI form={form} />
}
```

### With React Hook Form (Migration)

```tsx
// TanStack Form can work alongside React Hook Form for migration
import { useForm as useRHF } from 'react-hook-form'

function HybridForm() {
  const rhf = useRHF({ mode: 'onChange' })
  const tanstackForm = useForm({
    defaultValues: rhf.getValues(),
  })

  // Sync values
  useEffect(() => {
    const subscription = rhf.watch((value) => {
      tanstackForm.setValue('field', value.field)
    })
    return () => subscription.unsubscribe()
  }, [])

  return <FormUI form={tanstackForm} />
}
```

## createFormHook

Create reusable form hooks with pre-bound components:

```tsx
// src/lib/form-setup.ts
import { createFormHook, createFormHookContexts } from '@tanstack/react-form'

const { fieldContext, formContext } = createFormHookContexts()

export const { useAppForm, AppForm, AppField } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField: ({ label, name }) => (
      <AppField name={name}>
        {(field) => (
          <div>
            <label>{label}</label>
            <input value={field.state.value} onChange={field.handleChange} />
          </div>
        )}
      </AppField>
    ),
  },
  formComponents: {
    SubmitButton: ({ children }) => (
      <AppForm>
        <button type="submit">{children}</button>
      </AppForm>
    ),
  },
})
```

## Best Practices

### 1. Form Options Pattern

```tsx
// Create form options in a separate file
// src/forms/contact-form-options.ts
export const contactFormOpts = formOptions({
  defaultValues: { name: '', email: '', message: '' },
  validators: {
    onChange: z.object({
      /* ... */
    }),
  },
})

// Use in component
const form = useForm(contactFormOpts)
```

### 2. Error Display

```tsx
<form.Field name="email">
  {(field) => (
    <div>
      <input
        value={field.state.value}
        onChange={field.handleChange}
        onBlur={field.handleBlur}
      />
      {(field.state.meta.errors.length > 0 ||
        (field.state.meta.isValidating && <span>Validating...</span>)) && (
        <div className="error">
          {field.state.meta.errors.map((err) => (
            <span key={err}>{err}</span>
          ))}
        </div>
      )}
    </div>
  )}
</form.Field>
```

### 3. Server Validation Integration

```tsx
async function onSubmitValidForm({ value }) {
  // Attempt server validation
  const serverErrors = await validateOnServer(value)

  if (serverErrors) {
    // Merge server errors
    form.setErrorMap(serverErrors)
    return
  }

  // Submit if no server errors
  await submitToAPI(value)
}
```

## API Reference

### useForm Options

| Option                 | Type                             | Description               |
| ---------------------- | -------------------------------- | ------------------------- |
| `defaultValues`        | `T`                              | Initial form values       |
| `validators`           | `FormValidators<T>`              | Validation rules          |
| `formId`               | `string`                         | Form identifier           |
| `asyncDebounceMs`      | `number`                         | Debounce async validation |
| `canSubmitWhenInvalid` | `boolean`                        | Allow invalid submit      |
| `onSubmit`             | `(formApi, meta, value) => void` | Submit handler            |

### Form State Properties

| Property        | Type           | Description         |
| --------------- | -------------- | ------------------- |
| `values`        | `T`            | Current form values |
| `errors`        | `FormErrorMap` | Field errors        |
| `touchedFields` | `TouchedMap`   | Touched fields      |
| `dirtyFields`   | `DirtyMap`     | Modified fields     |
| `isValid`       | `boolean`      | Form validity       |
| `isSubmitting`  | `boolean`      | Submitting state    |
| `isSubmitted`   | `boolean`      | Submitted state     |

## Related Documents

- **Architecture Overview**: [architecture.md](./architecture.md)
- **TanStack Start**: [tanstack-start.md](./tanstack-start.md)
- **TanStack Query**: [tanstack-query.md](./tanstack-query.md)
- **Official Docs**: https://tanstack.com/form/latest
- **GitHub**: https://github.com/TanStack/form

---

**Last Updated**: January 5, 2026
**Version**: 1.0.0
