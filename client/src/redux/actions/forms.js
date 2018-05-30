export const EDIT_FORM_FIELD = 'EDIT_FORM_FIELD';

export const editFormField = (form, field, value) => ({
  type: EDIT_FORM_FIELD,
  form,
  field,
  value,
});

