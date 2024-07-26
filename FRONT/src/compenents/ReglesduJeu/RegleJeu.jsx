import React from "react";
import styles from "./RegleJeu.module.scss";

export default function RegleJeu() {
  return (
    <div className={`d-flex flex-column flex-fill center m-10 ${styles.regle}`}>
      <h1>Règles du jeu Puissance 4</h1>
      <p>
        Le but du jeu consiste à disposer 4 de vos jetons de couleur en ligne,
        que ce soit de manière horizontale, verticale ou diagonale.
      </p>
      <h2>Matériel :</h2>
      <ul>
        <li>-Un plateau de jeu composé de 6 rangées et 7 colonnes.</li>
        <li>-Deux couleurs de jetons</li>
      </ul>
      <h2>Déroulement du jeu :</h2>
      <ol>
        <li>
          À chaque tour, un joueur sélectionne une colonne et dépose un jeton
          dans celle-ci. Le jeton descend jusqu'à la position la plus basse
          offerte dans cette colonne.
        </li>
        <li>Le prochain joueur effectue la même opération.</li>
      </ol>
      <h2>Fin de la partie :</h2>
      <p>
        La partie s'achève quand un joueur aligne 4 jetons de sa couleur en
        ligne (horizontalement, verticalement ou en diagonale) ou quand toutes
        les colonnes sont pleines, ce qui donne une égalité.
      </p>
      <h2>Règles supplémentaires :</h2>
      <ul>
        <li>
          Il est interdit aux joueurs de retirer des jetons une fois qu'ils ont
          été placés sur le plateau.
        </li>
        <li>
          Si les joueurs sont égaux, le jeu peut être recommencé ou les joueurs
          peuvent s'entendre sur un autre résultat.
        </li>
      </ul>
    </div>
  );
}
