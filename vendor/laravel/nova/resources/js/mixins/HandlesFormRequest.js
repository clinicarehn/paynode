import { Errors } from '../util/FormValidation'

/**
 * @typedef {import('axios').AxiosResponse} AxiosResponse
 */

export default {
  props: {
    formUniqueId: {
      type: String,
    },
  },

  data: () => ({
    validationErrors: new Errors(),
  }),

  methods: {
    /**
     * Handle all response error.
     *
     * @param {AxiosResponse} error
     */
    handleResponseError(error) {
      Nova.debug(error, 'error')

      if (error.response === undefined || error.response.status == 500) {
        Nova.error(this.__('There was a problem submitting the form.'))
      } else if (error.response.status == 422) {
        this.validationErrors = new Errors(error.response.data.errors)
        Nova.error(this.__('There was a problem submitting the form.'))
      } else {
        Nova.error(
          this.__('There was a problem submitting the form.') +
            ' "' +
            error.response.statusText +
            '"'
        )
      }
    },

    /**
     * Handle creating response error.
     *
     * @param {AxiosResponse} error
     */
    handleOnCreateResponseError(error) {
      this.handleResponseError(error)
    },

    /**
     * Handle updating response error.
     *
     * @param {AxiosResponse} error
     */
    handleOnUpdateResponseError(error) {
      if (error.response && error.response.status == 409) {
        Nova.error(
          this.__(
            'Another user has updated this resource since this page was loaded. Please refresh the page and try again.'
          )
        )
      } else {
        this.handleResponseError(error)
      }
    },

    /**
     * Reset validation errors.
     */
    resetErrors() {
      this.validationErrors = new Errors()
    },
  },
}
