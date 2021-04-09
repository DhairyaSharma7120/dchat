import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from "next/Link"
import Image from "next/image"
export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

     

      <main className={styles.main}>
      <Image
        src="/images/nextLogoBlack.png"
        alt="Picture of the author"
        width={400}
        height={200}
      />
        <p className={styles.description}>
          Get started by checking{' '}
          <code className={styles.code}><Link href="admin">keystone admin dashboard</Link></code>
        </p>

        <div className={styles.grid}>
          <Link href="/whatsapp"><a href="" className={styles.card}>
            <h3>WhatsApp Clone &rarr;</h3>
            <p>clone of whatsapp using nextjs reactjs</p>
          </a></Link>

         
          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h3>Deploy &rarr;</h3>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          Drockss
        </a>
      </footer>
    </div>
  )
}
