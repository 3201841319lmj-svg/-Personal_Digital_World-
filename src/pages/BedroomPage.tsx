import React from 'react';
import { DreamPillow } from '../components/Bedroom/DreamPillow';
import styles from '../components/Bedroom/Bedroom.module.css';

export const BedroomPage: React.FC = () => {
  return (
    <div className={styles.bedroomPageWrapper}>
      {/* Direct Full-Screen Dream Chat View */}
      <DreamPillow />
    </div>
  );
};
