export function JSONUrlLoadedIndicator() {
  return (
    <section>
      <p>
        Currently JSON is loaded in <b>URL</b> mode.
      </p>
      <p>
        Be aware that if you change the loader method to others,{' '}
        <b>you'll lose your data from URL</b>.
      </p>
    </section>
  )
}
