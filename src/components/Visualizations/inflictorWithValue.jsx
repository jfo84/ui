/* global API_HOST */
/* eslint-disable react/no-danger */
import React from 'react';
import ReactTooltip from 'react-tooltip';
import uuid from 'node-uuid';
import items from 'dotaconstants/json/items.json';
import abilities from 'dotaconstants/json/abilities.json';
import strings from 'lang';
import styles from './inflictorWithValue.css';

const tooltipContainer = thing => (
  <div>
    <div className={styles.heading}>
      {thing.dname}
      {thing.cost &&
      <span className={styles.gold}>
        <img src={`${API_HOST}/apps/dota2/images/tooltips/gold.png`} role="presentation" />
        {thing.cost}
      </span>}
      {thing.lore &&
      <span className={styles.lore}>{thing.lore}</span>}
      {(thing.attrib || thing.affects || thing.dmg) && <hr />}
    </div>
    <div dangerouslySetInnerHTML={{ __html: thing.affects }} />
    <div dangerouslySetInnerHTML={{ __html: thing.attrib }} className={styles.noBr} />
    <div dangerouslySetInnerHTML={{ __html: thing.dmg }} />
    {(thing.cd || thing.mc || thing.cmb) && !thing.lore && !thing.attrib && <hr />}
    {(thing.cd || thing.mc || thing.cmb) &&
    <div className={styles.cost}>
      {thing.mc > 0 &&
      <span>
        <img src={`${API_HOST}/apps/dota2/images/tooltips/mana.png`} role="presentation" />
        {thing.mc}
      </span>}
      {thing.cd > 0 &&
      <span>
        <img src={`${API_HOST}/apps/dota2/images/tooltips/cooldown.png`} role="presentation" />
        {thing.cd}
      </span>}
      {thing.cmb &&
      <div
        dangerouslySetInnerHTML={{
          __html: thing.cmb
            .replace(/http:\/\/cdn\.dota2\.com/g, API_HOST),
        }}
        className={`${styles.noBr} ${styles.cmb}`}
      />}
    </div>}
  </div>
);

export default (inflictor, value, type) => {
  if (inflictor !== undefined) {
    // TODO use abilities if we need the full info immediately
    const ability = abilities[inflictor];
    const item = items[inflictor];
    let image, numericDisplay;
    let tooltip = strings.tooltip_autoattack_other;
    const ttId = uuid.v4();

    if (value === null) {
      numericDisplay = <div className={styles.overlay}></div>;
    } else {
      numericDisplay = <div className={styles.overlay}>{value}</div>;
    }

    if (ability) {
      image = `${API_HOST}/apps/dota2/images/abilities/${inflictor}_lg.png`;
      tooltip = tooltipContainer(ability);
    } else if (item) {
      image = `${API_HOST}/apps/dota2/images/items/${inflictor}_lg.png`;
      tooltip = tooltipContainer(item);
    } else {
      image = '/assets/images/default_attack.png';
    }
    return (
      <div className={styles.inflictorWithValue} data-tip={tooltip && true} data-for={ttId}>
        {!type && <img src={image} role="presentation" />}
        {type === 'buff' &&
          <div
            className={styles.buff}
            style={{
              backgroundImage: `url(${image})`,
            }}
          />
        }
        {!type && numericDisplay}
        {type === 'buff' &&
          <div className={styles.buffOverlay}>
            {value > 0 && value}
          </div>
        }
        {tooltip &&
        <div className={styles.tooltip}>
          <ReactTooltip id={ttId} effect="solid" place="left">
            {tooltip}
          </ReactTooltip>
        </div>}
      </div>
    );
  }
  return null;
};
