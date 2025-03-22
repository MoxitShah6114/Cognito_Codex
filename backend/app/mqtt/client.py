import paho.mqtt.client as mqtt
from app.core.config import settings
import logging
from typing import Dict, Any, Optional, Callable
import json

logger = logging.getLogger(__name__)

class MQTTClient:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MQTTClient, cls).__new__(cls)
        # Add the missing callback_api_version parameter
            cls._instance.client = mqtt.Client(callback_api_version=mqtt.CallbackAPIVersion.VERSION1)
            cls._instance.connected = False
            cls._instance.handlers = {}
        return cls._instance
    
    def connect(self):
        """Connect to MQTT broker"""
        if self.connected:
            return
            
        try:
            # Set up client
            self.client.on_connect = self._on_connect
            self.client.on_message = self._on_message
            self.client.on_disconnect = self._on_disconnect
            
            # Set username and password if provided
            if settings.MQTT_USER and settings.MQTT_PASSWORD:
                self.client.username_pw_set(settings.MQTT_USER, settings.MQTT_PASSWORD)
            
            # Connect to broker (with error handling)
            try:
                self.client.connect(settings.MQTT_BROKER, settings.MQTT_PORT, 60)
                
                # Start the loop in a separate thread
                self.client.loop_start()
            except Exception as e:
                logger.warning(f"MQTT connection disabled: {str(e)}")
                # Don't raise the exception - allow the app to run without MQTT
            
        except Exception as e:
            logger.error(f"Error configuring MQTT client: {str(e)}")
            
    def disconnect(self):
        """Disconnect from MQTT broker"""
        if not self.connected:
            return
            
        try:
            self.client.loop_stop()
            self.client.disconnect()
            self.connected = False
            logger.info("Disconnected from MQTT broker")
        except Exception as e:
            logger.error(f"Error disconnecting from MQTT broker: {str(e)}")
    
    def publish(self, topic: str, payload: Dict[str, Any], qos: int = 0, retain: bool = False):
        """Publish a message to a topic"""
        try:
            # Convert payload to JSON
            message = json.dumps(payload)
            
            # Publish message
            result = self.client.publish(topic, message, qos, retain)
            
            # Check if publish was successful
            if result.rc != mqtt.MQTT_ERR_SUCCESS:
                logger.error(f"Failed to publish message to {topic}: {mqtt.error_string(result.rc)}")
                
        except Exception as e:
            logger.error(f"Error publishing MQTT message: {str(e)}")
    
    def subscribe(self, topic: str, handler: Callable[[str, Dict[str, Any]], None], qos: int = 0):
        """Subscribe to a topic"""
        try:
            # Subscribe to topic
            result, _ = self.client.subscribe(topic, qos)
            
            # Check if subscription was successful
            if result != mqtt.MQTT_ERR_SUCCESS:
                logger.error(f"Failed to subscribe to {topic}: {mqtt.error_string(result)}")
                return
            
            # Register handler
            self.handlers[topic] = handler
            logger.info(f"Subscribed to topic: {topic}")
            
        except Exception as e:
            logger.error(f"Error subscribing to MQTT topic: {str(e)}")
    
    def _on_connect(self, client, userdata, flags, rc):
        """Callback when connected to MQTT broker"""
        if rc == 0:
            self.connected = True
            logger.info("Connected to MQTT broker")
        else:
            logger.error(f"Failed to connect to MQTT broker: {mqtt.connack_string(rc)}")
    
    def _on_disconnect(self, client, userdata, rc):
        """Callback when disconnected from MQTT broker"""
        self.connected = False
        if rc != 0:
            logger.error(f"Unexpected disconnection from MQTT broker: {mqtt.error_string(rc)}")
    
    def _on_message(self, client, userdata, msg):
        """Callback when message received"""
        try:
            # Decode message
            payload = json.loads(msg.payload.decode())
            
            # Find handler for topic
            for topic_pattern, handler in self.handlers.items():
                if mqtt.topic_matches_sub(topic_pattern, msg.topic):
                    handler(msg.topic, payload)
                    break
                    
        except json.JSONDecodeError:
            logger.error(f"Failed to decode JSON from MQTT message: {msg.payload}")
        except Exception as e:
            logger.error(f"Error handling MQTT message: {str(e)}")
