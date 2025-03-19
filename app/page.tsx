
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Welcome to Next.js on Replit!</h1>

      <p className={styles.description}>
        Get started by editing{" "}
        <code className={styles.code}>app/page.tsx</code>
      </p>

      <div className={styles.grid}>
        <a href="https://nextjs.org/docs" className={styles.card}>
          <h2>Documentation &rarr;</h2>
          <p>Find in-depth information about Next.js features and API.</p>
        </a>

        <a href="https://nextjs.org/learn" className={styles.card}>
          <h2>Learn &rarr;</h2>
          <p>Learn about Next.js in an interactive course with quizzes!</p>
        </a>

        <a
          href="https://github.com/vercel/next.js/tree/canary/examples"
          className={styles.card}
        >
          <h2>Examples &rarr;</h2>
          <p>Discover and deploy boilerplate example Next.js projects.</p>
        </a>

        <a
          href="https://docs.replit.com/category/deployments"
          className={styles.card}
        >
          <h2>Deploy &rarr;</h2>
          <p>After you are happy with this app, deploy it on Replit!</p>
        </a>
      </div>
    </main>
  )
}
