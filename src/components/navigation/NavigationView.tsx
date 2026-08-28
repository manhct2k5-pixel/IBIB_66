import React from 'react';
import { LandmarkNavigationView, LandmarkNavigationViewProps } from './LandmarkNavigationView';

export type NavigationViewProps = LandmarkNavigationViewProps;

/**
 * NavigationView chính của MedNav 108:
 * Chuyển sang mô hình Landmark-First Navigation thân thiện với người bệnh & người cao tuổi.
 */
export const NavigationView: React.FC<NavigationViewProps> = (props) => {
  return <LandmarkNavigationView {...props} />;
};

export { LandmarkNavigationView };
