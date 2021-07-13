from rest_framework import serializers


class TokenExchangeSerializer(serializers.Serializer):
    temporary_token = serializers.CharField(write_only=True)
