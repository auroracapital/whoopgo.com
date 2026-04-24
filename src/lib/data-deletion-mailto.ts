const DATA_DELETION_SUPPORT_EMAIL = "support@whoopgo.app"

const SUBJECT_PREFIX = "Data Deletion Request — "

function buildDeletionRequestBody(accountEmailLine: string): string {
  return [
    "Hi WhoopGO! team,",
    "",
    "I would like to request full deletion of my account and associated personal data.",
    "",
    `Account email: ${accountEmailLine}`,
    "",
    "Thanks.",
  ].join("\n")
}

export function buildDataDeletionMailtoHref(userEmail?: string | null): string {
  const trimmed = userEmail?.trim()
  const accountLine = trimmed && trimmed.length > 0 ? trimmed : "<your email>"
  const subject = `${SUBJECT_PREFIX}${accountLine}`
  const body = buildDeletionRequestBody(accountLine)
  const params = new URLSearchParams({ subject, body })
  return `mailto:${DATA_DELETION_SUPPORT_EMAIL}?${params.toString()}`
}
