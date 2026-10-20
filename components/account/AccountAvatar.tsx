import Image from "next/image";
import { User } from "@phosphor-icons/react";
import styles from "./Account.module.css";

export function AccountAvatar({ avatar, size = 34 }: { avatar?: string | null; size?: number }) {
  return <span className={styles.avatar} style={{ width: size, height: size }} aria-hidden="true">
    {avatar ? <Image src={avatar} alt="" width={128} height={128} unoptimized /> : <User weight="fill" />}
  </span>;
}

export function WavingPerson() {
  return <span className={styles.person} aria-hidden="true" />;
}
